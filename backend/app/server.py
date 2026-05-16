import logging
import time
import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from pydantic import ValidationError
from app.main.routes import admin, kpis, meta
from app.main.core.logging import setup_logging
from app.main.core.messages import ErrorMessages

setup_logging()
logger = structlog.get_logger("api")

app = FastAPI(title="Igeos Analytics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time_ms = round((time.time() - start_time) * 1000, 2)
    
    logger.info(
        "http.request",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=process_time_ms,
    )
    return response
@app.exception_handler(OperationalError)
async def db_connection_error_handler(request: Request, exc: OperationalError):
    logger.error("db.connection.error", error=str(exc))
    return JSONResponse(
        status_code=503,
        content={"detail": ErrorMessages.SERVICE_UNAVAILABLE}
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    logger.error("db.query.error", error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": ErrorMessages.INTERNAL_SERVER_ERROR}
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(admin.router)
app.include_router(kpis.router)
app.include_router(meta.router)
