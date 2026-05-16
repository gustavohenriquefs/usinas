import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from main.models.dim_subsistema import DimSubsistema


class FatoCmoSemanal(SQLModel, table=True):
    """Custo Marginal de Operação (CMO) semanal por subsistema e patamar de carga.

    Fonte: br_ons_estimativa_custos_custo_marginal_operacao_semanal.csv
    O CMO é o principal indicador de preço do mercado de energia brasileiro
    e serve de base para o PLD (Preço de Liquidação das Diferenças).
    Valores em R$/MWh com 4 casas decimais (NUMERIC evita erros de float).
    """

    __tablename__: str = "fato_cmo_semanal"  # type: ignore
    __table_args__ = (UniqueConstraint("data", "id_subsistema"),)

    id: int | None = Field(default=None, primary_key=True)
    data: datetime.date = Field(index=True)
    ano: int
    mes: int
    id_subsistema: int = Field(foreign_key="dim_subsistema.id", index=True)

    cmo_medio_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)
    cmo_carga_leve_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)
    cmo_carga_media_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)
    cmo_carga_pesada_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)

    subsistema: "DimSubsistema" = Relationship(back_populates="cmos_semanais")
