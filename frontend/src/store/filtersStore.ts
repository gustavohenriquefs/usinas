import { create } from 'zustand';
import type { FiltersState, FilterValues, Granularidade, ScenarioKey } from '../types';

const DEFAULT_VALUES: FilterValues = {
  dataInicio:    '2024-01-01',
  dataFim:       '2024-03-31',
  subsistema:    null,
  granularidade: 'month',
  scenario:      null,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...DEFAULT_VALUES,
  draft: { ...DEFAULT_VALUES },

  setDraftDateRange: (inicio: string, fim: string) =>
    set((state) => ({ draft: { ...state.draft, dataInicio: inicio, dataFim: fim, scenario: null } })),

  setDraftSubsistema: (sub: string | null) =>
    set((state) => ({ draft: { ...state.draft, subsistema: sub } })),

  setDraftGranularidade: (g: Granularidade) =>
    set((state) => ({ draft: { ...state.draft, granularidade: g } })),

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
        granularidade: 'day',
        scenario:   'peakHour',
      },
    };

    set((state) => ({ draft: { ...state.draft, ...presets[key] } }));
  },

  applyFilters: () =>
    set((state) => ({
      dataInicio: state.draft.dataInicio,
      dataFim: state.draft.dataFim,
      subsistema: state.draft.subsistema,
      granularidade: state.draft.granularidade,
      scenario: state.draft.scenario,
    })),

  reset: () =>
    set({
      ...DEFAULT_VALUES,
      draft: { ...DEFAULT_VALUES },
    }),
}));
