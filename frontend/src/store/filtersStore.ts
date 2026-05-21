import { create } from 'zustand';
import type { FiltersState, FilterValues, ScenarioKey } from '../types';

const DEFAULT_VALUES: FilterValues = {
  dataInicio:    '2024-01-01',
  dataFim:       '2024-03-31',
  subsistema:    null,
  scenario:      null,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...DEFAULT_VALUES,
  draft: { ...DEFAULT_VALUES },

  setDraftDateRange: (inicio: string, fim: string) =>
    set((state) => ({ draft: { ...state.draft, dataInicio: inicio, dataFim: fim, scenario: null } })),

  setDraftSubsistema: (sub: string | null) =>
    set((state) => ({ draft: { ...state.draft, subsistema: sub } })),

  applyDraftScenario: (key: ScenarioKey) => {
    if (!key) {
      return set((state) => ({ draft: { ...state.draft, scenario: null } }));
    }

    const presets: Record<NonNullable<ScenarioKey>, Partial<FilterValues>> = {
      drought: {
        dataInicio: '2021-01-01',
        dataFim:    '2021-12-31',
        scenario:   'drought',
      },
      thermalCrisis: {
        dataInicio: '2014-01-01',
        dataFim:    '2015-12-31',
        scenario:   'thermalCrisis',
      },
      peakHour: {
        dataInicio: '2024-01-01',
        dataFim:    '2024-03-31',
        scenario:   'peakHour',
      },
    };

    // Toggle: clicar no cenário ativo o desativa
    set((state) => {
      if (state.draft.scenario === key) {
        return { draft: { ...state.draft, scenario: null } };
      }
      return { draft: { ...state.draft, ...presets[key] } };
    });
  },

  applyFilters: () =>
    set((state) => ({
      dataInicio: state.draft.dataInicio,
      dataFim: state.draft.dataFim,
      subsistema: state.draft.subsistema,
      scenario: state.draft.scenario,
    })),

  reset: () =>
    set({
      ...DEFAULT_VALUES,
      draft: { ...DEFAULT_VALUES },
    }),
}));
