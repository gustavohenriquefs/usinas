import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from main.models.dim_subsistema import DimSubsistema


class FatoCmoSemiHorario(SQLModel, table=True):
    """CMO semi-horário calculado pelo modelo DESSEM.

    Fonte: br_ons_estimativa_custos_custo_marginal_operacao_semi_horario.csv
    Alta frequência (30 min) — permite identificar variações intradiárias
    de custo que o CMO semanal não captura.
    Valor em R$/MWh com 4 casas decimais.
    """

    __tablename__ = "fato_cmo_semi_horario"
    __table_args__ = (UniqueConstraint("data", "hora", "id_subsistema"),)

    id: int | None = Field(default=None, primary_key=True)
    data: datetime.date = Field(index=True)
    hora: datetime.time
    ano: int
    mes: int
    id_subsistema: int = Field(foreign_key="dim_subsistema.id", index=True)

    cmo_reais_mwh: Decimal | None = Field(default=None, decimal_places=4, max_digits=12)

    subsistema: "DimSubsistema" = Relationship(back_populates="cmos_semi_horarios")
