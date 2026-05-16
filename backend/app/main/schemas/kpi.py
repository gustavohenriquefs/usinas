from pydantic import BaseModel

class CmoSemanalItem(BaseModel):
    codigo: str
    data: str
    cmo_medio_reais_mwh: float
    cmo_carga_leve_reais_mwh: float
    cmo_carga_media_reais_mwh: float
    cmo_carga_pesada_reais_mwh: float

class BalancoHorarioItem(BaseModel):
    codigo: str
    periodo: str
    hidraulica_twh: float
    termica_twh: float
    eolica_twh: float
    fotovoltaica_twh: float
    carga_twh: float
    intercambio_twh: float

class RenovavelItem(BaseModel):
    codigo: str
    pct_renovavel: float

class CvuUsinaItem(BaseModel):
    nome: str
    codigo: str
    cvu_medio: float
    cvu_min: float
    cvu_max: float

class PerfilDemandaItem(BaseModel):
    codigo: str
    hora_dia: int
    demanda_media_twh: float

class IntercambioItem(BaseModel):
    codigo: str
    periodo: str
    intercambio_twh: float
