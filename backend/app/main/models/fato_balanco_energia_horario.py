import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger
from sqlmodel import Column, Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from main.models.dim_subsistema import DimSubsistema


class FatoBalancoEnergiaHorario(SQLModel, table=True):
    """Balanço de energia verificado por subsistema, granularidade horária.

    Fonte: br_ons_estimativa_custos_balanco_energia_subsistemas.csv
    Cobre o período de 2000 a 2024 com ~1 milhão de registros.
    Valores de energia em Wh — BIGINT necessário (chegam a ~10^13).
    """

    __tablename__: str = "fato_balanco_energia_horario"  # type: ignore
    __table_args__ = (UniqueConstraint("data", "hora", "id_subsistema"),)

    id: int | None = Field(default=None, primary_key=True)
    data: datetime.date = Field(index=True)
    hora: datetime.time
    ano: int
    mes: int
    id_subsistema: int = Field(foreign_key="dim_subsistema.id", index=True)

    geracao_hidraulica_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))
    geracao_termica_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))
    geracao_eolica_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))
    geracao_fotovoltaica_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))
    carga_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))
    intercambio_wh: int | None = Field(default=None, sa_column=Column(BigInteger, nullable=True))

    subsistema: "DimSubsistema" = Relationship(back_populates="balancos_horarios")
