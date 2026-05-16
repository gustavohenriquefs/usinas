import structlog
from typing import List, Optional
from datetime import date
from sqlalchemy import select
from sqlmodel import Session, func, col
from app.main.models.dim_subsistema import DimSubsistema
from app.main.models.dim_usina import DimUsina
from app.main.models.fato_cmo_semanal import FatoCmoSemanal
from app.main.models.fato_balanco_energia_horario import FatoBalancoEnergiaHorario
from app.main.models.fato_cvu_usinas_termicas import FatoCvuUsinaTermica
from app.main.schemas.kpi import (
    CmoSemanalItem, BalancoHorarioItem, RenovavelItem,
    CvuUsinaItem, PerfilDemandaItem, IntercambioItem
)
from app.main.schemas.pagination import PaginatedResponse

logger = structlog.get_logger("api")

def get_cmo_semanal(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[CmoSemanalItem]:
    logger.info("kpi.cmo_semanal.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    query = select(  # type: ignore
        DimSubsistema.codigo,
        func.to_char(FatoCmoSemanal.data, 'YYYY-MM-DD').label('data_str'),
        func.avg(FatoCmoSemanal.cmo_medio_reais_mwh).label('cmo_medio'),
        func.avg(FatoCmoSemanal.cmo_carga_leve_reais_mwh).label('cmo_leve'),
        func.avg(FatoCmoSemanal.cmo_carga_media_reais_mwh).label('cmo_media'),
        func.avg(FatoCmoSemanal.cmo_carga_pesada_reais_mwh).label('cmo_pesada')
    ).join(DimSubsistema).where(
        FatoCmoSemanal.data >= data_inicio,
        FatoCmoSemanal.data <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimSubsistema.codigo, FatoCmoSemanal.data).order_by(FatoCmoSemanal.data)

    results = session.exec(query).all()
    
    items = []
    for r in results:
        items.append(CmoSemanalItem(
            codigo=r.codigo,
            data=r.data_str,
            cmo_medio_reais_mwh=float(r.cmo_medio) if r.cmo_medio else 0.0,
            cmo_carga_leve_reais_mwh=float(r.cmo_leve) if r.cmo_leve else 0.0,
            cmo_carga_media_reais_mwh=float(r.cmo_media) if r.cmo_media else 0.0,
            cmo_carga_pesada_reais_mwh=float(r.cmo_pesada) if r.cmo_pesada else 0.0,
        ))

    logger.info("kpi.cmo_semanal.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_balanco_horario(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[BalancoHorarioItem]:
    logger.info("kpi.balanco_horario.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    TWH_DIVISOR = 1_000_000_000_000.0
    
    query = select(  # type: ignore
        DimSubsistema.codigo,
        func.to_char(FatoBalancoEnergiaHorario.data, 'YYYY-MM').label('periodo_str'),
        func.sum(FatoBalancoEnergiaHorario.geracao_hidraulica_wh).label('hidro'),
        func.sum(FatoBalancoEnergiaHorario.geracao_termica_wh).label('termica'),
        func.sum(FatoBalancoEnergiaHorario.geracao_eolica_wh).label('eolica'),
        func.sum(FatoBalancoEnergiaHorario.geracao_fotovoltaica_wh).label('foto'),
        func.sum(FatoBalancoEnergiaHorario.carga_wh).label('carga'),
        func.sum(FatoBalancoEnergiaHorario.intercambio_wh).label('intercambio')
    ).join(DimSubsistema).where(
        FatoBalancoEnergiaHorario.data >= data_inicio,
        FatoBalancoEnergiaHorario.data <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimSubsistema.codigo, 'periodo_str').order_by('periodo_str')

    results = session.exec(query).all()
    
    items = []
    for r in results:
        items.append(BalancoHorarioItem(
            codigo=r.codigo,
            periodo=r.periodo_str,
            hidraulica_twh=(int(r.hidro) if r.hidro else 0) / TWH_DIVISOR,
            termica_twh=(int(r.termica) if r.termica else 0) / TWH_DIVISOR,
            eolica_twh=(int(r.eolica) if r.eolica else 0) / TWH_DIVISOR,
            fotovoltaica_twh=(int(r.foto) if r.foto else 0) / TWH_DIVISOR,
            carga_twh=(int(r.carga) if r.carga else 0) / TWH_DIVISOR,
            intercambio_twh=(int(r.intercambio) if r.intercambio else 0) / TWH_DIVISOR,
        ))

    logger.info("kpi.balanco_horario.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_renovavel(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[RenovavelItem]:
    logger.info("kpi.renovavel.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    query = select(  # type: ignore
        DimSubsistema.codigo,
        func.sum(FatoBalancoEnergiaHorario.geracao_hidraulica_wh).label('hidro'),
        func.sum(FatoBalancoEnergiaHorario.geracao_eolica_wh).label('eolica'),
        func.sum(FatoBalancoEnergiaHorario.geracao_fotovoltaica_wh).label('foto'),
        func.sum(FatoBalancoEnergiaHorario.geracao_termica_wh).label('termica')
    ).join(DimSubsistema).where(
        FatoBalancoEnergiaHorario.data >= data_inicio,
        FatoBalancoEnergiaHorario.data <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimSubsistema.codigo)

    results = session.exec(query).all()
    
    items = []
    for r in results:
        hidro = int(r.hidro) if r.hidro else 0
        eolica = int(r.eolica) if r.eolica else 0
        foto = int(r.foto) if r.foto else 0
        termica = int(r.termica) if r.termica else 0
        
        renovavel = hidro + eolica + foto
        total = renovavel + termica
        
        pct = (renovavel / total * 100) if total > 0 else 0.0
        
        items.append(RenovavelItem(
            codigo=r.codigo,
            pct_renovavel=round(pct, 2)
        ))

    logger.info("kpi.renovavel.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_cvu_usinas(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[CvuUsinaItem]:
    logger.info("kpi.cvu_usinas.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    query = select(  # type: ignore
        DimUsina.nome,
        DimSubsistema.codigo,
        func.avg(FatoCvuUsinaTermica.cvu_reais_mwh).label('cvu_medio'),
        func.min(FatoCvuUsinaTermica.cvu_reais_mwh).label('cvu_min'),
        func.max(FatoCvuUsinaTermica.cvu_reais_mwh).label('cvu_max')
    ).join(DimUsina, FatoCvuUsinaTermica.id_usina == DimUsina.id).join(DimSubsistema, DimUsina.id_subsistema == DimSubsistema.id).where(
        FatoCvuUsinaTermica.data_inicio >= data_inicio,
        FatoCvuUsinaTermica.data_inicio <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimUsina.nome, DimSubsistema.codigo)

    results = session.exec(query).all()
    
    items = []
    for r in results:
        items.append(CvuUsinaItem(
            nome=r.nome,
            codigo=r.codigo,
            cvu_medio=float(r.cvu_medio) if r.cvu_medio else 0.0,
            cvu_min=float(r.cvu_min) if r.cvu_min else 0.0,
            cvu_max=float(r.cvu_max) if r.cvu_max else 0.0
        ))

    # Ordenar por CVU Médio descrescente
    items.sort(key=lambda x: x.cvu_medio, reverse=True)

    logger.info("kpi.cvu_usinas.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_perfil_demanda(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[PerfilDemandaItem]:
    logger.info("kpi.perfil_demanda.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    TWH_DIVISOR = 1_000_000_000_000.0
    
    # Extract hour works for postgres to get hour from time/timestamp
    query = select(  # type: ignore
        DimSubsistema.codigo,
        func.extract('hour', col(FatoBalancoEnergiaHorario.hora)).label('hora_dia'),
        func.avg(FatoBalancoEnergiaHorario.carga_wh).label('demanda_media')
    ).join(DimSubsistema).where(
        FatoBalancoEnergiaHorario.data >= data_inicio,
        FatoBalancoEnergiaHorario.data <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimSubsistema.codigo, 'hora_dia').order_by('hora_dia')

    results = session.exec(query).all()
    
    items = []
    for r in results:
        items.append(PerfilDemandaItem(
            codigo=r.codigo,
            hora_dia=int(r.hora_dia),
            demanda_media_twh=(int(r.demanda_media) if r.demanda_media else 0) / TWH_DIVISOR
        ))

    logger.info("kpi.perfil_demanda.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))

def get_intercambio(
    session: Session, 
    data_inicio: date, 
    data_fim: date, 
    subsistema: Optional[str] = None
) -> PaginatedResponse[IntercambioItem]:
    logger.info("kpi.intercambio.request", start=str(data_inicio), end=str(data_fim), sub=subsistema)
    
    TWH_DIVISOR = 1_000_000_000_000.0
    
    query = select(  # type: ignore
        DimSubsistema.codigo,
        func.to_char(FatoBalancoEnergiaHorario.data, 'YYYY-MM').label('periodo_str'),
        func.sum(FatoBalancoEnergiaHorario.intercambio_wh).label('intercambio')
    ).join(DimSubsistema).where(
        FatoBalancoEnergiaHorario.data >= data_inicio,
        FatoBalancoEnergiaHorario.data <= data_fim
    )

    if subsistema:
        query = query.where(DimSubsistema.codigo == subsistema)

    query = query.group_by(DimSubsistema.codigo, 'periodo_str').order_by('periodo_str')

    results = session.exec(query).all()
    
    items = []
    for r in results:
        items.append(IntercambioItem(
            codigo=r.codigo,
            periodo=r.periodo_str,
            intercambio_twh=(int(r.intercambio) if r.intercambio else 0) / TWH_DIVISOR
        ))

    logger.info("kpi.intercambio.ok", count=len(items))
    return PaginatedResponse(items=items, total=len(items))
