import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from main.models.dim_usina import DimUsina


class FatoCvuUsinaTermica(SQLModel, table=True):
    """Custo Variável Unitário (CVU) das usinas termelétricas por semana operativa.

    Fonte: br_ons_estimativa_custos_custo_variavel_unitario_usinas_termicas.csv
    O CVU determina a ordem de despacho econômico: usinas com menor CVU
    são acionadas primeiro. Valor em R$/MWh com 4 casas decimais.
    """

    __tablename__: str = "fato_cvu_usinas_termicas"  # type: ignore
    __table_args__ = (UniqueConstraint("data_inicio", "id_usina", "numero_revisao"),)

    id: int | None = Field(default=None, primary_key=True)
    data_inicio: datetime.date = Field(index=True)
    data_fim: datetime.date
    ano: int
    mes: int
    ano_pmo: int
    mes_pmo: int
    numero_revisao: int
    semana_operativa: str = Field(max_length=60)
    id_usina: int = Field(foreign_key="dim_usina.id", index=True)

    cvu_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)

    usina: "DimUsina" = Relationship(back_populates="cvus")
