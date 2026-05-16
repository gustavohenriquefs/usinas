import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlmodel import SQLModel

# env.py fica em backend/alembic/ → parents[0] = backend/alembic, parents[1] = backend/
# Adiciona backend/ ao path para que 'import app.main' funcione
_src = Path(__file__).resolve().parent.parent
if str(_src) not in sys.path:
    sys.path.insert(0, str(_src))

# Importa todos os models para que o SQLModel os registre nos metadados
import app.main.models  # noqa: F401
from app.main.core.config import settings

# Objeto de configuração do Alembic
config = context.config

# Configura o logging a partir do alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadados do SQLModel — usados pelo autogenerate
target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    """Executa migrações sem conexão ativa (gera SQL puro)."""
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Executa migrações com conexão ativa ao banco."""
    from sqlalchemy import create_engine

    connectable = create_engine(settings.database_url)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
