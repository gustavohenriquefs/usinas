import structlog
from sqlmodel import Session, select
from sqlalchemy import func, text
from app.main.models.dim_subsistema import DimSubsistema
from app.main.models.dim_usina import DimUsina
from app.main.models.fato_balanco_energia_horario import FatoBalancoEnergiaHorario
from app.main.models.fato_balanco_energia_dessem import FatoBalancoEnergiaDessem
from app.main.models.fato_cmo_semanal import FatoCmoSemanal
from app.main.models.fato_cmo_semi_horario import FatoCmoSemiHorario
from app.main.models.fato_cvu_usinas_termicas import FatoCvuUsinaTermica
from app.main.schemas.meta import SubsistemaResponse, UsinaResponse, DatasetCoverageItem
from app.main.schemas.pagination import PaginatedResponse

logger = structlog.get_logger("api")

def list_subsistemas(session: Session) -> PaginatedResponse[SubsistemaResponse]:
    logger.info("meta.subsistemas.list.request")
    
    subsistemas = session.exec(select(DimSubsistema)).all()
    
    items = [SubsistemaResponse(id=s.id or 0, codigo=s.codigo, nome=s.nome) for s in subsistemas]
    
    logger.info("meta.subsistemas.list.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def list_usinas(session: Session) -> PaginatedResponse[UsinaResponse]:
    logger.info("meta.usinas.list.request")
    
    query = select(DimUsina.nome, DimSubsistema.codigo).join(DimSubsistema)
    usinas = session.exec(query).all()
    
    items = [UsinaResponse(nome=u[0], codigo_subsistema=u[1]) for u in usinas]
    
    logger.info("meta.usinas.list.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_cobertura(session: Session) -> list[DatasetCoverageItem]:
    """Retorna o intervalo de datas disponível em cada tabela fato."""
    logger.info("meta.cobertura.request")

    # Cada entrada: (slug, label, model, coluna_data)
    datasets = [
        ("balanco-horario",  "Balanço de Energia por Subsistema",          FatoBalancoEnergiaHorario, FatoBalancoEnergiaHorario.data),
        ("balanco-dessem",   "Balanço de Energia por Subsistema (DESSEM)", FatoBalancoEnergiaDessem,  FatoBalancoEnergiaDessem.data),
        ("cmo-semanal",      "Custo Marginal de Operação Semanal",         FatoCmoSemanal,            FatoCmoSemanal.data),
        ("cmo-semi-horario", "Custo Marginal de Operação Semi-Horário",    FatoCmoSemiHorario,        FatoCmoSemiHorario.data),
        ("cvu-usinas",       "Custo Variável Unitário das Usinas Térmicas",FatoCvuUsinaTermica,       FatoCvuUsinaTermica.data_inicio),
    ]

    items = []
    for slug, label, _model, col_data in datasets:
        row = session.exec(
            select(
                func.min(col_data).label("data_inicio"),
                func.max(col_data).label("data_fim"),
            ).select_from(_model)
        ).one()

        if row.data_inicio is None or row.data_fim is None:
            continue  # tabela vazia, omite

        items.append(DatasetCoverageItem(
            dataset=slug,
            label=label,
            data_inicio=str(row.data_inicio),
            data_fim=str(row.data_fim),
        ))

    logger.info("meta.cobertura.ok", count=len(items))
    return items
