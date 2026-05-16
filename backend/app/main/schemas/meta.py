from typing import List, Optional
from pydantic import BaseModel

class SubsistemaResponse(BaseModel):
    id: int
    codigo: str
    nome: str

class UsinaResponse(BaseModel):
    nome: str
    codigo_subsistema: str
