/**
 * useChartConfig(slug)
 * Returns the config_json for a given chart slug.
 *
 * cor      → accent color (used for markLine, ReferenceLine, card highlights)
 *             Does NOT override series colors — the library palette handles that.
 * unidade  → unit label shown in tooltips and axis
 * meta     → reference value rendered as a dashed line on the chart
 * decimais → decimal places in formatted values
 */
import { useKpiConfigs } from '../api/admin';

export interface ChartConfig {
  /** Accent color for reference lines and highlights (NOT series fill) */
  cor: string;
  /** Unit label shown in tooltips/axis */
  unidade: string;
  /** Decimal places for formatted values */
  decimais: number;
  /** Reference value — renders as a dashed line on the chart */
  meta: number | null;
}

const DEFAULTS: ChartConfig = {
  cor:      '#58a6ff',
  unidade:  '',
  decimais: 2,
  meta:     null,
};

export function useChartConfig(slug: string): ChartConfig {
  const { data: configs = [] } = useKpiConfigs();
  const found = configs.find((c) => c.slug === slug);
  if (!found) return DEFAULTS;
  const j = found.config_json as Partial<ChartConfig>;
  return {
    cor:      typeof j.cor      === 'string' ? j.cor      : DEFAULTS.cor,
    unidade:  typeof j.unidade  === 'string' ? j.unidade  : DEFAULTS.unidade,
    decimais: typeof j.decimais === 'number' ? j.decimais : DEFAULTS.decimais,
    meta:     typeof j.meta     === 'number' ? j.meta     : DEFAULTS.meta,
  };
}
