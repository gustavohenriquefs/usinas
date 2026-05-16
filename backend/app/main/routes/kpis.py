from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from datetime import date
from typing import Optional
from app.main.database.session import engine
from app.main.schemas.pagination import PaginatedResponse
from app.main.schemas.kpi import (
    CmoSemanalItem, BalancoHorarioItem, RenovavelItem,
    CvuUsinaItem, PerfilDemandaItem, IntercambioItem
)
from app.main.services import kpi_service

router = APIRouter(prefix="/api/kpis", tags=["KPIs"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/cmo-semanal", response_model=PaginatedResponse[CmoSemanalItem])
def get_cmo_semanal(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna o Custo Marginal de Operação (CMO) Semanal agregado.
    """
    return kpi_service.get_cmo_semanal(session, dataInicio, dataFim, subsistema)

@router.get("/balanco-horario", response_model=PaginatedResponse[BalancoHorarioItem])
def get_balanco_horario(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna o balanço de energia agregado por subsistema.
    """
    return kpi_service.get_balanco_horario(session, dataInicio, dataFim, subsistema)

@router.get("/renovavel", response_model=PaginatedResponse[RenovavelItem])
def get_renovavel(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna o percentual de energia renovável gerada.
    """
    return kpi_service.get_renovavel(session, dataInicio, dataFim, subsistema)

@router.get("/cvu-usinas", response_model=PaginatedResponse[CvuUsinaItem])
def get_cvu_usinas(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna os dados de Custo Variável Unitário (CVU) médio por usina térmica.
    """
    return kpi_service.get_cvu_usinas(session, dataInicio, dataFim, subsistema)

@router.get("/perfil-demanda", response_model=PaginatedResponse[PerfilDemandaItem])
def get_perfil_demanda(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna a curva de demanda horária agregada média.
    """
    return kpi_service.get_perfil_demanda(session, dataInicio, dataFim, subsistema)

@router.get("/intercambio", response_model=PaginatedResponse[IntercambioItem])
def get_intercambio(
    dataInicio: date = Query(..., description="Data inicial no formato YYYY-MM-DD"),
    dataFim: date = Query(..., description="Data final no formato YYYY-MM-DD"),
    subsistema: Optional[str] = Query(None, description="Código do subsistema (ex: SE, NE)"),
    session: Session = Depends(get_session)
):
    """
    Retorna o intercâmbio de energia por subsistema.
    """
    return kpi_service.get_intercambio(session, dataInicio, dataFim, subsistema)
