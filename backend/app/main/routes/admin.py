from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.main.database.session import engine
from app.main.schemas.kpi_config import KpiConfigCreate, KpiConfigUpdate, KpiConfigResponse
from app.main.schemas.pagination import PaginatedResponse
from app.main.services import admin_service

router = APIRouter(prefix="/api/admin/kpi-config", tags=["Admin"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("", response_model=PaginatedResponse[KpiConfigResponse])
def get_kpi_configs(session: Session = Depends(get_session)):
    """Retorna todas as configurações de KPIs"""
    return admin_service.list_kpi_configs(session)

@router.get("/active", response_model=PaginatedResponse[KpiConfigResponse])
def get_active_kpi_configs(session: Session = Depends(get_session)):
    """Retorna configurações de KPIs ativas"""
    return admin_service.list_kpi_configs(session, active_only=True)

@router.post("", response_model=KpiConfigResponse, status_code=status.HTTP_201_CREATED)
def create_kpi_config(config: KpiConfigCreate, session: Session = Depends(get_session)):
    """Cria uma nova configuração de KPI. Valida dados JSON via Pydantic."""
    return admin_service.create_kpi_config(session, config)

@router.patch("/{kpi_id}", response_model=KpiConfigResponse)
def update_kpi_config(kpi_id: int, config: KpiConfigUpdate, session: Session = Depends(get_session)):
    """Atualiza um KPI existente"""
    return admin_service.update_kpi_config(session, kpi_id, config)

@router.delete("/{kpi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kpi_config(kpi_id: int, session: Session = Depends(get_session)):
    """Exclui um KPI"""
    return admin_service.delete_kpi_config(session, kpi_id)

