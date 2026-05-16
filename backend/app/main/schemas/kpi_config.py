from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class KpiConfigJson(BaseModel):
    cor: str = Field(default="#3B82F6", description="Cor do gráfico em hexadecimal")
    unidade: Optional[str] = Field(default=None, description="Unidade de medida do KPI (ex: MWh, R$, %)")
    meta: Optional[float] = Field(default=None, description="Meta ou baseline do KPI")
    decimais: int = Field(default=2, description="Número de casas decimais para exibição")

class KpiConfigBase(BaseModel):
    slug: str = Field(..., description="Identificador único do KPI")
    titulo: str = Field(..., description="Título de exibição no painel")
    descricao: Optional[str] = Field(default=None, description="Descrição do KPI")
    status: str = Field(default="ativo", description="Status do KPI ('ativo' ou 'inativo')")
    visivel: bool = Field(default=True, description="Se o gráfico é exibido no dashboard")
    ordem: int = Field(default=0, description="Ordem de exibição no dashboard")
    config_json: KpiConfigJson = Field(default_factory=KpiConfigJson, description="Configurações de visualização JSON")

class KpiConfigCreate(KpiConfigBase):
    pass

class KpiConfigUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[str] = None
    visivel: Optional[bool] = None
    ordem: Optional[int] = None
    config_json: Optional[KpiConfigJson] = None

class KpiConfigResponse(KpiConfigBase):
    id: int
    criado_em: Optional[datetime] = None
    atualizado_em: Optional[datetime] = None

    class Config:
        from_attributes = True
