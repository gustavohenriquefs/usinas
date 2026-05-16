from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class KpiConfig(SQLModel, table=True):
    __tablename__: str = "kpi_config"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    titulo: str
    descricao: Optional[str] = Field(default=None)
    status: str = Field(default="ativo")
    visivel: bool = Field(default=True)
    ordem: int = Field(default=0)
    config_json: dict = Field(default={}, sa_column=Column(JSON))
    criado_em: datetime = Field(default_factory=_utcnow)
    atualizado_em: datetime = Field(default_factory=_utcnow)
