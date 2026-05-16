from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T] = Field(description="Lista de itens retornados")
    total: int = Field(description="Número total de itens disponíveis")
    page: Optional[int] = Field(default=1, description="Página atual")
    size: Optional[int] = Field(default=100, description="Tamanho da página")
