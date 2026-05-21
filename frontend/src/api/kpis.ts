import { useQuery } from '@tanstack/react-query';
import type {
  CmoSemanalItem, BalancoHorarioItem, RenovavelItem,
  CvuUsinaItem, PerfilDemandaItem, IntercambioItem,
  KpiQueryParams, KpiResponse,
} from '../types';
import {
  mockCmoSemanal, mockBalancoHorario, mockRenovavel,
  mockCvuUsinas, mockPerfilDemanda, mockIntercambio,
} from '../__mocks__';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function buildParams(p: KpiQueryParams): URLSearchParams {
  const params = new URLSearchParams({ dataInicio: p.dataInicio, dataFim: p.dataFim });
  if (p.subsistema)    params.set('subsistema',    p.subsistema);
  if (p.topN)          params.set('top_n',         String(p.topN));
  if (p.ano)           params.set('ano',            String(p.ano));
  return params;
}

async function get<T>(path: string, params: KpiQueryParams): Promise<KpiResponse<T>> {
  const res = await fetch(`${API_URL}${path}?${buildParams(params)}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  const data = await res.json();
  return {
    items:    data.items ?? data,
    total:    data.total ?? 0,
    coverage: data.coverage ?? null,
  };
}

/** Wrap mock data into KpiResponse shape (no coverage — mocks are always "complete") */
function mockResponse<T>(items: T[]): KpiResponse<T> {
  return { items, total: items.length, coverage: null };
}

// ── CMO Semanal ───────────────────────────────────────────────
export function useCmoSemanal(params: KpiQueryParams) {
  return useQuery<KpiResponse<CmoSemanalItem>>({
    queryKey: ['kpis', 'cmo-semanal', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockCmoSemanal))
      : get('/api/kpis/cmo-semanal', params),
    staleTime: 5 * 60_000,
  });
}

// ── Balanço Horário ───────────────────────────────────────────
export function useBalancoHorario(params: KpiQueryParams) {
  return useQuery<KpiResponse<BalancoHorarioItem>>({
    queryKey: ['kpis', 'balanco-horario', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockBalancoHorario))
      : get('/api/kpis/balanco-horario', params),
    staleTime: 5 * 60_000,
  });
}

// ── Renovável ─────────────────────────────────────────────────
export function useRenovavel(params: KpiQueryParams) {
  return useQuery<KpiResponse<RenovavelItem>>({
    queryKey: ['kpis', 'renovavel', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockRenovavel))
      : get('/api/kpis/renovavel', params),
    staleTime: 5 * 60_000,
  });
}

// ── CVU Usinas ────────────────────────────────────────────────
export function useCvuUsinas(params: KpiQueryParams) {
  return useQuery<KpiResponse<CvuUsinaItem>>({
    queryKey: ['kpis', 'cvu-usinas', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockCvuUsinas))
      : get('/api/kpis/cvu-usinas', params),
    staleTime: 5 * 60_000,
  });
}

// ── Perfil de Demanda ─────────────────────────────────────────
export function usePerfilDemanda(params: KpiQueryParams) {
  return useQuery<KpiResponse<PerfilDemandaItem>>({
    queryKey: ['kpis', 'perfil-demanda', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockPerfilDemanda))
      : get('/api/kpis/perfil-demanda', params),
    staleTime: 5 * 60_000,
  });
}

// ── Intercâmbio ───────────────────────────────────────────────
export function useIntercambio(params: KpiQueryParams) {
  return useQuery<KpiResponse<IntercambioItem>>({
    queryKey: ['kpis', 'intercambio', params],
    queryFn: () => USE_MOCKS
      ? Promise.resolve(mockResponse(mockIntercambio))
      : get('/api/kpis/intercambio', params),
    staleTime: 5 * 60_000,
  });
}
