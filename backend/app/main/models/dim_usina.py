from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from main.models.dim_subsistema import DimSubsistema
    from main.models.fato_cvu_usinas_termicas import FatoCvuUsinaTermica


class DimUsina(SQLModel, table=True):
    """Usinas termelétricas referenciadas nos dados de CVU.

    O par (id_modelo, id_subsistema) é único — o mesmo id_modelo pode
    existir em subsistemas diferentes no modelo ONS.
    """

    __tablename__ = "dim_usina"
    __table_args__ = (UniqueConstraint("id_modelo", "id_subsistema"),)

    id: int | None = Field(default=None, primary_key=True)
    id_modelo: int = Field(index=True)
    nome: str = Field(max_length=120)
    id_subsistema: int = Field(foreign_key="dim_subsistema.id")

    subsistema: "DimSubsistema" = Relationship(back_populates="usinas")
    cvus: list["FatoCvuUsinaTermica"] = Relationship(back_populates="usina")
