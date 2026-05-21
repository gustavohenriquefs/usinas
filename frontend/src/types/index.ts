// ============================================================
// IGEOS — Global TypeScript Interfaces
// Mirrors the REST API contracts defined in the backend
// (FastAPI / Pydantic schemas)
// ============================================================

// ── Meta ────────────────────────────────────────────────────
/** GET /api/meta/subsistemas */
export interface Subsistema {
  id: number;
  codigo: string; // "SE" | "S" | "NE" | "N" | "CO"
  nome: string;
}

/** GET /api/meta/usinas */
export interface Usina {
  id: number;
  nome: string;
  id_subsistema: number;
  subsistema_codigo: string;
}

/** GET /api/meta/cobertura — cobertura temporal de cada dataset */
export interface DatasetCoverage {
  dataset: string;   // slug, ex: "balanco-horario"
  label: string;     // nome legível
  data_inicio: string; // "YYYY-MM-DD"
  data_fim: string;    // "YYYY-MM-DD"
}

// ── Admin ────────────────────────────────────────────────────
/** KPI type, mirrors backend enum */
export type KpiTipo = 'card' | 'line' | 'bar' | 'area' | 'donut';

/** GET /api/admin/kpi-config  |  GET /api/admin/kpi-config/active */
export interface KpiConfig {
  id: number;
  slug: string;
  titulo: string;
  descricao: string | null;
  tipo: KpiTipo;
  endpoint_path: string;
  ordem: number;
  visivel: boolean;
  config_json: Record<string, unknown>;
  criado_em: string;   // ISO 8601
  atualizado_em: string;
}

/** POST / PATCH /api/admin/kpi-config */
export interface KpiConfigPayload {
  slug: string;
  titulo: string;
  descricao?: string;
  tipo: KpiTipo;
  endpoint_path: string;
  ordem?: number;
  visivel?: boolean;
  config_json?: Record<string, unknown>;
}

// ── KPIs ─────────────────────────────────────────────────────
/** GET /api/kpis/cmo-semanal */
export interface CmoSemanalItem {
  codigo: string;
  data: string; // "YYYY-MM-DD"
  cmo_medio_reais_mwh: number;
  cmo_carga_leve_reais_mwh: number;
  cmo_carga_media_reais_mwh: number;
  cmo_carga_pesada_reais_mwh: number;
}

/** GET /api/kpis/balanco-horario */
export interface BalancoHorarioItem {
  codigo: string;
  periodo: string; // "YYYY-MM-DD" | "YYYY-MM" | "YYYY"
  hidraulica_twh: number;
  termica_twh: number;
  eolica_twh: number;
  fotovoltaica_twh: number;
  carga_twh: number;
  intercambio_twh: number;
}

/** GET /api/kpis/renovavel */
export interface RenovavelItem {
  codigo: string;
  pct_renovavel: number; // 0–100
}

/** GET /api/kpis/cvu-usinas */
export interface CvuUsinaItem {
  nome: string;
  codigo: string;
  cvu_medio: number;
  cvu_min: number;
  cvu_max: number;
}

/** GET /api/kpis/perfil-demanda */
export interface PerfilDemandaItem {
  codigo: string;
  hora_dia: number; // 0–23
  demanda_media_twh: number;
}

/** GET /api/kpis/intercambio */
export interface IntercambioItem {
  codigo: string;
  periodo: string;
  intercambio_twh: number;
}

// ── Filter Store ─────────────────────────────────────────────

export type ScenarioKey = 'drought' | 'thermalCrisis' | 'peakHour' | null;

export interface FilterValues {
  dataInicio: string;
  dataFim: string;
  subsistema: string | null;
  scenario: ScenarioKey;
}

export interface FiltersState extends FilterValues {
  draft: FilterValues;

  // Actions
  setDraftDateRange: (inicio: string, fim: string) => void;
  setDraftSubsistema: (sub: string | null) => void;
  applyDraftScenario: (key: ScenarioKey) => void;
  
  applyFilters: () => void;
  reset: () => void;
}

// ── Query Params (used to build queryKey and fetch URL) ──────
export interface KpiQueryParams {
  dataInicio: string;
  dataFim: string;
  subsistema?: string | null;
  topN?: number;
  ano?: number;
}

// ── Data Coverage (returned alongside KPI data) ──────────────
/** Período efetivamente coberto pelos dados retornados pela API */
export interface DataCoverage {
  data_inicio_solicitada: string;
  data_fim_solicitada: string;
  data_inicio_efetiva: string | null;
  data_fim_efetiva: string | null;
  /** false quando o dataset não cobre todo o período solicitado */
  cobertura_completa: boolean;
}

export interface KpiResponse<T> {
  items: T[];
  total: number;
  coverage: DataCoverage | null;
}
