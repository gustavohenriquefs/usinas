"""Utilitário para calcular a cobertura temporal de uma resposta KPI.

Uso:
    coverage = build_coverage(
        data_inicio_solicitada=data_inicio,
        data_fim_solicitada=data_fim,
        datas_efetivas=[r.data for r in results],  # lista de date ou str
    )
    return PaginatedResponse(items=items, total=len(items), coverage=coverage)
"""

from datetime import date
from typing import Sequence, Union

from app.main.schemas.pagination import DataCoverage

DateLike = Union[date, str]


def _to_str(d: DateLike) -> str:
    return str(d)[:10]  # garante "YYYY-MM-DD" tanto para date quanto str


def build_coverage(
    data_inicio_solicitada: date,
    data_fim_solicitada: date,
    datas_efetivas: Sequence[DateLike],
) -> DataCoverage:
    """Compara o período solicitado com as datas realmente presentes nos resultados.

    - Se `datas_efetivas` estiver vazio, `cobertura_completa=False` e as datas
      efetivas ficam None — sinal claro de que não há dados para o período.
    - `cobertura_completa=True` apenas quando o primeiro registro está na data
      solicitada (ou antes) E o último está na data solicitada (ou depois).
    """
    req_inicio = _to_str(data_inicio_solicitada)
    req_fim    = _to_str(data_fim_solicitada)

    if not datas_efetivas:
        return DataCoverage(
            data_inicio_solicitada=req_inicio,
            data_fim_solicitada=req_fim,
            data_inicio_efetiva=None,
            data_fim_efetiva=None,
            cobertura_completa=False,
        )

    strs = [_to_str(d) for d in datas_efetivas]
    efetiva_inicio = min(strs)
    efetiva_fim    = max(strs)

    cobertura_completa = (efetiva_inicio <= req_inicio) and (efetiva_fim >= req_fim)

    return DataCoverage(
        data_inicio_solicitada=req_inicio,
        data_fim_solicitada=req_fim,
        data_inicio_efetiva=efetiva_inicio,
        data_fim_efetiva=efetiva_fim,
        cobertura_completa=cobertura_completa,
    )
