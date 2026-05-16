import structlog
from sqlmodel import Session, select
from app.main.models.dim_subsistema import DimSubsistema
from app.main.models.dim_usina import DimUsina
from app.main.schemas.meta import SubsistemaResponse, UsinaResponse
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
