from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from main.models.dim_usina import DimUsina
    from main.models.fato_balanco_energia_dessem import FatoBalancoEnergiaDessem
    from main.models.fato_balanco_energia_horario import FatoBalancoEnergiaHorario
    from main.models.fato_cmo_semi_horario import FatoCmoSemiHorario
    from main.models.fato_cmo_semanal import FatoCmoSemanal


class DimSubsistema(SQLModel, table=True):
    """Subsistemas do Sistema Interligado Nacional (SIN).

    Exemplos: N (Norte), NE (Nordeste), S (Sul), SE (Sudeste/Centro-Oeste).
    Serve como dimensão central referenciada por todas as tabelas de fato.
    """

    __tablename__ = "dim_subsistema"

    id: int | None = Field(default=None, primary_key=True)
    codigo: str = Field(max_length=10, unique=True, index=True)
    nome: str = Field(max_length=60)

    # Relacionamentos reversos (usados pelo ORM, não pelo seed)
    usinas: list["DimUsina"] = Relationship(back_populates="subsistema")
    balancos_horarios: list["FatoBalancoEnergiaHorario"] = Relationship(
        back_populates="subsistema"
    )
    balancos_dessem: list["FatoBalancoEnergiaDessem"] = Relationship(
        back_populates="subsistema"
    )
    cmos_semanais: list["FatoCmoSemanal"] = Relationship(back_populates="subsistema")
    cmos_semi_horarios: list["FatoCmoSemiHorario"] = Relationship(
        back_populates="subsistema"
    )
