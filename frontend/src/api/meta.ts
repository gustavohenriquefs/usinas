import { useQuery } from '@tanstack/react-query';
import type { Subsistema, Usina } from '../types';
import { mockSubsistemas, mockUsinas } from '../__mocks__';

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

export function useSubsistemas() {
  return useQuery<Subsistema[]>({
    queryKey: ['meta', 'subsistemas'],
    queryFn: fetchSubsistemas,
    staleTime: Infinity, // meta rarely changes
  });
}

export function useUsinas() {
  return useQuery<Usina[]>({
    queryKey: ['meta', 'usinas'],
    queryFn: fetchUsinas,
    staleTime: Infinity,
  });
}
