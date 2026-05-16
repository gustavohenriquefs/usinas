import structlog
from sqlmodel import Session, select, col
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.main.models.kpi_config import KpiConfig
from app.main.schemas.kpi_config import KpiConfigCreate, KpiConfigUpdate
from app.main.core.messages import ErrorMessages
from app.main.schemas.pagination import PaginatedResponse

logger = structlog.get_logger("api")

def list_kpi_configs(session: Session, active_only: bool = False) -> PaginatedResponse[KpiConfig]:
    logger.info("admin.kpi_config.list.request", active_only=active_only)
    query = select(KpiConfig)
    if active_only:
        query = query.where(KpiConfig.visivel == True)  # noqa: E712
    query = query.order_by(col(KpiConfig.ordem))
    configs = session.exec(query).all()
    logger.info("admin.kpi_config.list.ok", count=len(configs))
    
    return PaginatedResponse(
        items=list(configs),
        total=len(configs),
        page=1,
        size=len(configs)
    )

def create_kpi_config(session: Session, config: KpiConfigCreate) -> KpiConfig:
    logger.info("admin.kpi_config.create.request", slug=config.slug)
    try:
        db_kpi = KpiConfig(
            slug=config.slug,
            titulo=config.titulo,
            status=config.status,
            config_json=config.config_json.model_dump()
        )
        session.add(db_kpi)
        session.commit()
        session.refresh(db_kpi)
        logger.info("admin.kpi_config.create.ok", id=db_kpi.id)
        return db_kpi
    except IntegrityError:
        session.rollback()
        logger.error("admin.kpi_config.create.error", reason="IntegrityError", slug=config.slug)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ErrorMessages.KPI_ALREADY_EXISTS.format(slug=config.slug)
        )

def update_kpi_config(session: Session, kpi_id: int, config: KpiConfigUpdate) -> KpiConfig:
    logger.info("admin.kpi_config.update.request", id=kpi_id)
    db_kpi = session.get(KpiConfig, kpi_id)
    if not db_kpi:
        logger.warning("admin.kpi_config.update.not_found", id=kpi_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.KPI_NOT_FOUND.format(id=kpi_id)
        )
    
    from datetime import datetime, timezone
    update_data = config.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_kpi, key, value)
    db_kpi.atualizado_em = datetime.now(timezone.utc)

    session.add(db_kpi)
    session.commit()
    session.refresh(db_kpi)
    logger.info("admin.kpi_config.update.ok", id=db_kpi.id)
    return db_kpi

def delete_kpi_config(session: Session, kpi_id: int) -> None:
    logger.info("admin.kpi_config.delete.request", id=kpi_id)
    db_kpi = session.get(KpiConfig, kpi_id)
    if not db_kpi:
        logger.warning("admin.kpi_config.delete.not_found", id=kpi_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.KPI_NOT_FOUND.format(id=kpi_id)
        )
    
    session.delete(db_kpi)
    session.commit()
    logger.info("admin.kpi_config.delete.ok", id=kpi_id)
