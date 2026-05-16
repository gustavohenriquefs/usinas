import { useQuery } from '@tanstack/react-query';
import type { Subsistema, Usina, DatasetCoverage } from '../types';
import { mockSubsistemas, mockUsinas, mockCobertura } from '../__mocks__';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function fetchSubsistemas(): Promise<Subsistema[]> {
  if (USE_MOCKS) return mockSubsistemas;
  const res = await fetch(`${API_URL}/api/meta/subsistemas`);
  if (!res.ok) throw new Error('Failed to fetch subsistemas');
  const data = await res.json();
  return data.items ?? data;
}

async function fetchUsinas(): Promise<Usina[]> {
  if (USE_MOCKS) return mockUsinas;
  const res = await fetch(`${API_URL}/api/meta/usinas`);
  if (!res.ok) throw new Error('Failed to fetch usinas');
  const data = await res.json();
  return data.items ?? data;
}

async function fetchCobertura(): Promise<DatasetCoverage[]> {
  if (USE_MOCKS) return mockCobertura;
  const res = await fetch(`${API_URL}/api/meta/cobertura`);
  if (!res.ok) throw new Error('Failed to fetch cobertura');
  return res.json();
}

export function useSubsistemas() {
  return useQuery<Subsistema[]>({
    queryKey: ['meta', 'subsistemas'],
    queryFn: fetchSubsistemas,
    staleTime: Infinity,
  });
}

export function useUsinas() {
  return useQuery<Usina[]>({
    queryKey: ['meta', 'usinas'],
    queryFn: fetchUsinas,
    staleTime: Infinity,
  });
}

export function useCobertura() {
  return useQuery<DatasetCoverage[]>({
    queryKey: ['meta', 'cobertura'],
    queryFn: fetchCobertura,
    staleTime: Infinity, // cobertura só muda quando novos dados são carregados
  });
}
