from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")

class DataCoverage(BaseModel):
    """Período efetivamente coberto pelos dados retornados.
    
    Pode diferir do período solicitado quando o dataset não possui
    dados para todo o intervalo pedido. Use para informar o cliente
    sobre dados parciais ou ausentes.
    """
    data_inicio_solicitada: str = Field(description="Período solicitado pelo cliente (YYYY-MM-DD)")
    data_fim_solicitada: str    = Field(description="Período solicitado pelo cliente (YYYY-MM-DD)")
    data_inicio_efetiva: Optional[str] = Field(default=None, description="Primeiro registro encontrado (YYYY-MM-DD)")
    data_fim_efetiva: Optional[str]    = Field(default=None, description="Último registro encontrado (YYYY-MM-DD)")
    cobertura_completa: bool = Field(description="True se os dados cobrem todo o período solicitado")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T] = Field(description="Lista de itens retornados")
    total: int = Field(description="Número total de itens disponíveis")
    page: Optional[int] = Field(default=1, description="Página atual")
    size: Optional[int] = Field(default=100, description="Tamanho da página")
    coverage: Optional[DataCoverage] = Field(default=None, description="Cobertura temporal dos dados retornados")
