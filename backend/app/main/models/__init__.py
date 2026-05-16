# Importar todos os models aqui garante que o SQLModel/Alembic
# os descubra automaticamente ao importar este pacote.
from app.main.models.dim_subsistema import DimSubsistema
from app.main.models.dim_usina import DimUsina
from app.main.models.fato_balanco_energia_dessem import FatoBalancoEnergiaDessem
from app.main.models.fato_balanco_energia_horario import FatoBalancoEnergiaHorario
from app.main.models.fato_cmo_semi_horario import FatoCmoSemiHorario
from app.main.models.fato_cmo_semanal import FatoCmoSemanal
from app.main.models.fato_cvu_usinas_termicas import FatoCvuUsinaTermica

__all__ = [
    "DimSubsistema",
    "DimUsina",
    "FatoBalancoEnergiaHorario",
    "FatoBalancoEnergiaDessem",
    "FatoCmoSemanal",
    "FatoCmoSemiHorario",
    "FatoCvuUsinaTermica",
]
