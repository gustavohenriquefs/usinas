from collections.abc import Generator

from sqlmodel import Session, create_engine

from main.core.config import settings

engine = create_engine(settings.database_url, echo=False)


def get_session() -> Generator[Session, None, None]:
    """Dependency para injeção de sessão nas rotas FastAPI."""
    with Session(engine) as session:
        yield session
