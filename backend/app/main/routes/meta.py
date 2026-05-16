from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.main.database.session import engine
from app.main.schemas.pagination import PaginatedResponse
from app.main.schemas.meta import SubsistemaResponse, UsinaResponse
from app.main.services import meta_service

router = APIRouter(prefix="/api/meta", tags=["Meta"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/subsistemas", response_model=PaginatedResponse[SubsistemaResponse])
def get_subsistemas(session: Session = Depends(get_session)):
    """Retorna a lista de todos os subsistemas"""
    return meta_service.list_subsistemas(session)

@router.get("/usinas", response_model=PaginatedResponse[UsinaResponse])
def get_usinas(session: Session = Depends(get_session)):
    """Retorna a lista de usinas e seus subsistemas"""
    return meta_service.list_usinas(session)
