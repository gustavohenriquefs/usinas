import { useQuery } from '@tanstack/react-query';
import type {
  CmoSemanalItem, BalancoHorarioItem, RenovavelItem,
  CvuUsinaItem, PerfilDemandaItem, IntercambioItem,
  KpiQueryParams,
} from '../types';
import {
  mockCmoSemanal, mockBalancoHorario, mockRenovavel,
  mockCvuUsinas, mockPerfilDemanda, mockIntercambio,
} from '../__mocks__';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function buildParams(p: KpiQueryParams): URLSearchParams {
  const params = new URLSearchParams({
    data_inicio: p.dataInicio,
    data_fim:    p.dataFim,
  });
  if (p.subsistema)    params.set('subsistema',    p.subsistema);
  if (p.granularidade) params.set('granularidade', p.granularidade);
  if (p.topN)          params.set('top_n',         String(p.topN));
  if (p.ano)           params.set('ano',            String(p.ano));
  return params;
}

async function get<T>(path: string, params: KpiQueryParams): Promise<T> {
  const res = await fetch(`${API_URL}${path}?${buildParams(params)}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

// ── CMO Semanal ───────────────────────────────────────────────
export function useCmoSemanal(params: KpiQueryParams) {
  return useQuery<CmoSemanalItem[]>({
    queryKey: ['kpis', 'cmo-semanal', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockCmoSemanal)
                : get('/api/kpis/cmo-semanal', params),
    staleTime: 5 * 60_000,
  });
}

// ── Balanço Horário ───────────────────────────────────────────
export function useBalancoHorario(params: KpiQueryParams) {
  return useQuery<BalancoHorarioItem[]>({
    queryKey: ['kpis', 'balanco-horario', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockBalancoHorario)
                : get('/api/kpis/balanco-horario', params),
    staleTime: 5 * 60_000,
  });
}

// ── Renovável ─────────────────────────────────────────────────
export function useRenovavel(params: KpiQueryParams) {
  return useQuery<RenovavelItem[]>({
    queryKey: ['kpis', 'renovavel', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockRenovavel)
                : get('/api/kpis/renovavel', params),
    staleTime: 5 * 60_000,
  });
}

// ── CVU Usinas ────────────────────────────────────────────────
export function useCvuUsinas(params: KpiQueryParams) {
  return useQuery<CvuUsinaItem[]>({
    queryKey: ['kpis', 'cvu-usinas', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockCvuUsinas)
                : get('/api/kpis/cvu-usinas', params),
    staleTime: 5 * 60_000,
  });
}

// ── Perfil de Demanda ─────────────────────────────────────────
export function usePerfilDemanda(params: KpiQueryParams) {
  return useQuery<PerfilDemandaItem[]>({
    queryKey: ['kpis', 'perfil-demanda', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockPerfilDemanda)
                : get('/api/kpis/perfil-demanda', params),
    staleTime: 5 * 60_000,
  });
}

// ── Intercâmbio ───────────────────────────────────────────────
export function useIntercambio(params: KpiQueryParams) {
  return useQuery<IntercambioItem[]>({
    queryKey: ['kpis', 'intercambio', params],
    queryFn: () =>
      USE_MOCKS ? Promise.resolve(mockIntercambio)
                : get('/api/kpis/intercambio', params),
    staleTime: 5 * 60_000,
  });
}
