import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { KpiConfig, KpiConfigPayload } from '../types';
import { mockKpiConfigs, mockActiveKpiConfigs } from '../__mocks__';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ── Queries ──────────────────────────────────────────────────
export function useKpiConfigs() {
  return useQuery<KpiConfig[]>({
    queryKey: ['admin', 'kpi-config'],
    queryFn: async () => {
      if (USE_MOCKS) return mockKpiConfigs;
      const res = await fetch(`${API_URL}/api/admin/kpi-config`);
      if (!res.ok) throw new Error('Failed to fetch kpi-config');
      const data = await res.json();
      return data.items ?? data;
    },
  });
}

export function useActiveKpiConfigs() {
  return useQuery<KpiConfig[]>({
    queryKey: ['admin', 'kpi-config', 'active'],
    queryFn: async () => {
      if (USE_MOCKS) return mockActiveKpiConfigs;
      const res = await fetch(`${API_URL}/api/admin/kpi-config/active`);
      if (!res.ok) throw new Error('Failed to fetch active kpi-config');
      const data = await res.json();
      return data.items ?? data;
    },
  });
}

// ── Mutations ────────────────────────────────────────────────
export function useCreateKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: KpiConfigPayload) => {
      if (USE_MOCKS) {
        // Simulate API response in mock mode
        return { id: Date.now(), ...payload, criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString() } as KpiConfig;
      }
      const res = await fetch(`${API_URL}/api/admin/kpi-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create kpi-config');
      return res.json() as Promise<KpiConfig>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'kpi-config'] }),
  });
}

export function useUpdateKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<KpiConfigPayload> }) => {
      if (USE_MOCKS) return { id, ...payload } as KpiConfig;
      const res = await fetch(`${API_URL}/api/admin/kpi-config/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update kpi-config');
      return res.json() as Promise<KpiConfig>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'kpi-config'] }),
  });
}

export function useDeleteKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (USE_MOCKS) return;
      const res = await fetch(`${API_URL}/api/admin/kpi-config/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete kpi-config');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'kpi-config'] }),
  });
}

/** Bulk patch: update `ordem` for multiple configs after drag & drop */
export function useReorderKpiConfigs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: Array<{ id: number; ordem: number }>) => {
      if (USE_MOCKS) return;
      await Promise.all(
        items.map((item) =>
          fetch(`${API_URL}/api/admin/kpi-config/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ordem: item.ordem }),
          })
        )
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'kpi-config'] }),
  });
}
