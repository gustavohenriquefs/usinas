"""Script de seed para popular o banco com os dados iniciais da ONS.

Execução (a partir de backend/):
    python -m main.database.seed

O script é idempotente: usa INSERT ... ON CONFLICT DO NOTHING, portanto
pode ser re-executado sem duplicar dados.

Estratégia de carga:
- Dimensões (subsistemas, usinas) são inseridas primeiro via ORM e seus IDs
  são mantidos em dicionários em memória para evitar queries extras.
- Fatos são carregados em chunks via pandas + executemany do SQLAlchemy Core
  para máxima performance em arquivos grandes (~1 M de linhas).
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

import pandas as pd
from sqlalchemy import text
from sqlmodel import Session, select

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from main.database.session import engine  # noqa: E402
from main.models import (  # noqa: E402
    DimSubsistema,
    DimUsina,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# seed.py está em backend/src/main/database/ → parents[4] = raiz do repo
DATA_DIR = Path(__file__).resolve().parents[4] / "data_seed"

CHUNK_SIZE = 50_000


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _int_or_none(value) -> int | None:
    if pd.isna(value):
        return None
    return int(value)


def _float_or_none(value) -> float | None:
    if pd.isna(value):
        return None
    return float(value)


def _bulk_insert(session: Session, stmt: str, records: list[dict]) -> None:
    """Executa um INSERT em lote usando a conexão SQLAlchemy Core."""
    if not records:
        return
    conn = session.connection()
    conn.execute(text(stmt), records)
    session.commit()


# ---------------------------------------------------------------------------
# Dimensões
# ---------------------------------------------------------------------------

def seed_subsistemas(session: Session) -> dict[str, int]:
    """Insere os subsistemas únicos encontrados nos CSVs. Retorna {codigo: id}."""
    log.info("Carregando dimensão: subsistemas...")

    subsistemas: dict[str, str] = {}
    for csv_file in DATA_DIR.glob("*.csv"):
        cols = pd.read_csv(csv_file, nrows=0).columns.tolist()
        if "id_subsistema" not in cols or "subsistema" not in cols:
            continue
        df = pd.read_csv(
            csv_file,
            usecols=["id_subsistema", "subsistema"],
            dtype=str,
        ).drop_duplicates()
        for _, row in df.iterrows():
            subsistemas[row["id_subsistema"].strip()] = row["subsistema"].strip()

    for codigo, nome in subsistemas.items():
        if not session.exec(select(DimSubsistema).where(DimSubsistema.codigo == codigo)).first():
            session.add(DimSubsistema(codigo=codigo, nome=nome))
    session.commit()

    mapping = {r.codigo: r.id for r in session.exec(select(DimSubsistema)).all()}
    log.info("  %d subsistemas carregados.", len(mapping))
    return mapping


def seed_usinas(session: Session, sub_map: dict[str, int]) -> None:
    """Insere as usinas termelétricas únicas."""
    log.info("Carregando dimensão: usinas termelétricas...")

    csv_path = DATA_DIR / "br_ons_estimativa_custos_custo_variavel_unitario_usinas_termicas.csv"
    df = pd.read_csv(
        csv_path,
        usecols=["id_modelo_usina", "id_subsistema", "usina"],
        dtype={"id_modelo_usina": "Int64", "id_subsistema": str, "usina": str},
    ).drop_duplicates(subset=["id_modelo_usina", "id_subsistema"])

    for _, row in df.iterrows():
        id_modelo = int(row["id_modelo_usina"])
        id_sub = sub_map.get(str(row["id_subsistema"]).strip())
        if id_sub is None:
            continue
        if not session.exec(
            select(DimUsina).where(DimUsina.id_modelo == id_modelo, DimUsina.id_subsistema == id_sub)
        ).first():
            session.add(DimUsina(id_modelo=id_modelo, nome=str(row["usina"]).strip(), id_subsistema=id_sub))
    session.commit()

    count = len(session.exec(select(DimUsina)).all())
    log.info("  %d usinas carregadas.", count)


# ---------------------------------------------------------------------------
# Fatos
# ---------------------------------------------------------------------------

def seed_balanco_horario(session: Session, sub_map: dict[str, int]) -> None:
    csv_path = DATA_DIR / "br_ons_estimativa_custos_balanco_energia_subsistemas.csv"
    log.info("Carregando fato: balanço de energia horário (%s)...", csv_path.name)

    stmt = """
        INSERT INTO fato_balanco_energia_horario
            (data, hora, ano, mes, id_subsistema,
             geracao_hidraulica_wh, geracao_termica_wh,
             geracao_eolica_wh, geracao_fotovoltaica_wh,
             carga_wh, intercambio_wh)
        VALUES
            (:data, :hora, :ano, :mes, :id_subsistema,
             :geracao_hidraulica_wh, :geracao_termica_wh,
             :geracao_eolica_wh, :geracao_fotovoltaica_wh,
             :carga_wh, :intercambio_wh)
        ON CONFLICT (data, hora, id_subsistema) DO NOTHING
    """

    total = 0
    for chunk in pd.read_csv(csv_path, chunksize=CHUNK_SIZE, dtype={"hora": str, "id_subsistema": str}):
        records = [
            {
                "data": str(row["data"]),
                "hora": str(row["hora"]).strip(),
                "ano": int(row["ano"]),
                "mes": int(row["mes"]),
                "id_subsistema": sub_map[str(row["id_subsistema"]).strip()],
                "geracao_hidraulica_wh": _int_or_none(row["geracao_hidraulica_verificada"]),
                "geracao_termica_wh": _int_or_none(row["geracao_termica_verificada"]),
                "geracao_eolica_wh": _int_or_none(row["geracao_eolica_verificada"]),
                "geracao_fotovoltaica_wh": _int_or_none(row["geracao_fotovoltaica_verificada"]),
                "carga_wh": _int_or_none(row["carga_verificada"]),
                "intercambio_wh": _int_or_none(row["intercambio_verificado"]),
            }
            for _, row in chunk.iterrows()
            if str(row["id_subsistema"]).strip() in sub_map
        ]
        _bulk_insert(session, stmt, records)
        total += len(records)
        log.info("  %d linhas inseridas até agora...", total)

    log.info("  Balanço horário concluído: %d linhas.", total)


def seed_balanco_dessem(session: Session, sub_map: dict[str, int]) -> None:
    csv_path = DATA_DIR / "br_ons_estimativa_custos_balanco_energia_subsistemas_dessem.csv"
    log.info("Carregando fato: balanço DESSEM (%s)...", csv_path.name)

    stmt = """
        INSERT INTO fato_balanco_energia_dessem
            (data, hora, ano, mes, id_subsistema,
             valor_demanda_wh, geracao_hidraulica_wh,
             geracao_pequena_hidraulica_wh, geracao_termica_wh,
             geracao_pequena_termica_wh, geracao_eolica_wh,
             geracao_fotovoltaica_wh)
        VALUES
            (:data, :hora, :ano, :mes, :id_subsistema,
             :valor_demanda_wh, :geracao_hidraulica_wh,
             :geracao_pequena_hidraulica_wh, :geracao_termica_wh,
             :geracao_pequena_termica_wh, :geracao_eolica_wh,
             :geracao_fotovoltaica_wh)
        ON CONFLICT (data, hora, id_subsistema) DO NOTHING
    """

    total = 0
    for chunk in pd.read_csv(csv_path, chunksize=CHUNK_SIZE, dtype={"hora": str, "id_subsistema": str}):
        records = [
            {
                "data": str(row["data"]),
                "hora": str(row["hora"]).strip(),
                "ano": int(row["ano"]),
                "mes": int(row["mes"]),
                "id_subsistema": sub_map[str(row["id_subsistema"]).strip()],
                "valor_demanda_wh": _int_or_none(row["valor_demanda"]),
                "geracao_hidraulica_wh": _int_or_none(row["usina_hidraulica_verificada"]),
                "geracao_pequena_hidraulica_wh": _int_or_none(row["geracao_pequena_usina_hidraulica_verificada"]),
                "geracao_termica_wh": _int_or_none(row["geracao_usina_termica_verificada"]),
                "geracao_pequena_termica_wh": _int_or_none(row["geracao_pequena_usina_termica_verificada"]),
                "geracao_eolica_wh": _int_or_none(row["geracao_eolica_verificada"]),
                "geracao_fotovoltaica_wh": _int_or_none(row["geracao_fotovoltaica_verificada"]),
            }
            for _, row in chunk.iterrows()
            if str(row["id_subsistema"]).strip() in sub_map
        ]
        _bulk_insert(session, stmt, records)
        total += len(records)
        log.info("  %d linhas inseridas até agora...", total)

    log.info("  Balanço DESSEM concluído: %d linhas.", total)


def seed_cmo_semanal(session: Session, sub_map: dict[str, int]) -> None:
    csv_path = DATA_DIR / "br_ons_estimativa_custos_custo_marginal_operacao_semanal.csv"
    log.info("Carregando fato: CMO semanal (%s)...", csv_path.name)

    stmt = """
        INSERT INTO fato_cmo_semanal
            (data, ano, mes, id_subsistema,
             cmo_medio_reais_mwh, cmo_carga_leve_reais_mwh,
             cmo_carga_media_reais_mwh, cmo_carga_pesada_reais_mwh)
        VALUES
            (:data, :ano, :mes, :id_subsistema,
             :cmo_medio_reais_mwh, :cmo_carga_leve_reais_mwh,
             :cmo_carga_media_reais_mwh, :cmo_carga_pesada_reais_mwh)
        ON CONFLICT (data, id_subsistema) DO NOTHING
    """

    def _cmo(v) -> float | None:
        raw = _float_or_none(v)
        return round(raw / 1e6, 4) if raw is not None else None

    df = pd.read_csv(csv_path, dtype={"id_subsistema": str})
    records = [
        {
            "data": str(row["data"]),
            "ano": int(row["ano"]),
            "mes": int(row["mes"]),
            "id_subsistema": sub_map[str(row["id_subsistema"]).strip()],
            "cmo_medio_reais_mwh": _cmo(row["custo_marginal_operacao_semanal"]),
            "cmo_carga_leve_reais_mwh": _cmo(row["custo_marginal_operacao_semanal_carga_leve"]),
            "cmo_carga_media_reais_mwh": _cmo(row["custo_marginal_operacao_semanal_carga_media"]),
            "cmo_carga_pesada_reais_mwh": _cmo(row["custo_marginal_operacao_semanal_carga_pesada"]),
        }
        for _, row in df.iterrows()
        if str(row["id_subsistema"]).strip() in sub_map
    ]
    _bulk_insert(session, stmt, records)
    log.info("  CMO semanal concluído: %d linhas.", len(records))


def seed_cmo_semi_horario(session: Session, sub_map: dict[str, int]) -> None:
    csv_path = DATA_DIR / "br_ons_estimativa_custos_custo_marginal_operacao_semi_horario.csv"
    log.info("Carregando fato: CMO semi-horário (%s)...", csv_path.name)

    stmt = """
        INSERT INTO fato_cmo_semi_horario
            (data, hora, ano, mes, id_subsistema, cmo_reais_mwh)
        VALUES
            (:data, :hora, :ano, :mes, :id_subsistema, :cmo_reais_mwh)
        ON CONFLICT (data, hora, id_subsistema) DO NOTHING
    """

    total = 0
    for chunk in pd.read_csv(csv_path, chunksize=CHUNK_SIZE, dtype={"hora": str, "id_subsistema": str}):
        records = []
        for _, row in chunk.iterrows():
            if str(row["id_subsistema"]).strip() not in sub_map:
                continue
            raw = _float_or_none(row["custo_marginal_operacao"])
            records.append({
                "data": str(row["data"]),
                "hora": str(row["hora"]).strip(),
                "ano": int(row["ano"]),
                "mes": int(row["mes"]),
                "id_subsistema": sub_map[str(row["id_subsistema"]).strip()],
                "cmo_reais_mwh": round(raw / 1e6, 4) if raw is not None else None,
            })
        _bulk_insert(session, stmt, records)
        total += len(records)
        log.info("  %d linhas inseridas até agora...", total)

    log.info("  CMO semi-horário concluído: %d linhas.", total)


def seed_cvu_usinas(session: Session, sub_map: dict[str, int]) -> None:
    csv_path = DATA_DIR / "br_ons_estimativa_custos_custo_variavel_unitario_usinas_termicas.csv"
    log.info("Carregando fato: CVU usinas termelétricas (%s)...", csv_path.name)

    # Monta mapa {(id_modelo, codigo_sub): usina_pk} via uma única query
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT u.id, u.id_modelo, s.codigo "
                "FROM dim_usina u JOIN dim_subsistema s ON s.id = u.id_subsistema"
            )
        ).all()
    usina_map: dict[tuple[int, str], int] = {
        (int(r[1]), str(r[2]).strip()): int(r[0]) for r in rows
    }

    stmt = """
        INSERT INTO fato_cvu_usinas_termicas
            (data_inicio, data_fim, ano, mes, ano_pmo, mes_pmo,
             numero_revisao, semana_operativa, id_usina, cvu_reais_mwh)
        VALUES
            (:data_inicio, :data_fim, :ano, :mes, :ano_pmo, :mes_pmo,
             :numero_revisao, :semana_operativa, :id_usina, :cvu_reais_mwh)
        ON CONFLICT (data_inicio, id_usina, numero_revisao) DO NOTHING
    """

    df = pd.read_csv(csv_path, dtype={"id_subsistema": str, "id_modelo_usina": "Int64"})
    records = []
    for _, row in df.iterrows():
        key = (int(row["id_modelo_usina"]), str(row["id_subsistema"]).strip())
        id_usina = usina_map.get(key)
        if id_usina is None:
            continue
        records.append({
            "data_inicio": str(row["data_inicio"]),
            "data_fim": str(row["data_fim"]),
            "ano": int(row["ano"]),
            "mes": int(row["mes"]),
            "ano_pmo": int(row["ano_pmo"]),
            "mes_pmo": int(row["mes_pmo"]),
            "numero_revisao": int(row["numero_revisao"]),
            "semana_operativa": str(row["semana_operativa"]).strip(),
            "id_usina": id_usina,
            "cvu_reais_mwh": _float_or_none(row["custo_variavel_unitario"]),
        })

    _bulk_insert(session, stmt, records)
    log.info("  CVU usinas concluído: %d linhas.", len(records))


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

def run() -> None:
    log.info("=== Iniciando seed do banco de dados ===")
    log.info("Fonte de dados: %s", DATA_DIR)

    with Session(engine) as session:
        sub_map = seed_subsistemas(session)
        seed_usinas(session, sub_map)
        seed_balanco_horario(session, sub_map)
        seed_balanco_dessem(session, sub_map)
        seed_cmo_semanal(session, sub_map)
        seed_cmo_semi_horario(session, sub_map)
        seed_cvu_usinas(session, sub_map)

    log.info("=== Seed concluído com sucesso ===")


if __name__ == "__main__":
    run()
