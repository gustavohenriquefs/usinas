from typing import List, Optional
from pydantic import BaseModel

class SubsistemaResponse(BaseModel):
    id: int
    codigo: str
    nome: str

class UsinaResponse(BaseModel):
    nome: str
    codigo_subsistema: str

class DatasetCoverageItem(BaseModel):
    """Cobertura temporal de um dataset (tabela fato)."""
    dataset: str        # slug identificador, ex: "balanco-horario"
    label: str          # nome legível para exibição
    data_inicio: str    # "YYYY-MM-DD"
    data_fim: str       # "YYYY-MM-DD"
