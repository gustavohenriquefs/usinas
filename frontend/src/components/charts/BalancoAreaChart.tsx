import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useBalancoHorario } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';

const FONTES = [
  { key: 'hidraulica_twh'   as const, i18n: 'legend.hidraulica' },
  { key: 'termica_twh'      as const, i18n: 'legend.termica' },
  { key: 'eolica_twh'       as const, i18n: 'legend.eolica' },
  { key: 'fotovoltaica_twh' as const, i18n: 'legend.fotovoltaica' },
];

export function BalancoAreaChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema, granularidade } = useFiltersStore();
  const { data = [], isLoading } = useBalancoHorario({ dataInicio, dataFim, subsistema, granularidade });
  const cfg = useChartConfig('balanco-horario');

  const periodos = [...new Set(data.map((d) => d.periodo))].sort();
  const unidade  = cfg.unidade || 'TWh';

  const markLine = cfg.meta != null ? {
    silent: true,
    data: [{ yAxis: cfg.meta,
      label: { formatter: `Meta: ${cfg.meta.toFixed(cfg.decimais)} ${unidade}`, color: cfg.cor },
      lineStyle: { type: 'dashed' as const, color: cfg.cor, width: 1.5 },
    }],
  } : undefined;

  // ECharts handles palette automatically per series
  const series = FONTES.map((f, i) => ({
    name: t(f.i18n),
    type: 'bar' as const,
    stack: 'total',
    data: periodos.map(
      (p) => data.filter((d) => d.periodo === p).reduce((s, d) => s + d[f.key], 0)
    ),
    ...(i === 0 && markLine ? { markLine } : {}),
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: '#1c2128', borderColor: '#30363d',
      textStyle: { color: '#e6edf3', fontSize: 12 },
      valueFormatter: (v: number) => `${v.toFixed(cfg.decimais)} ${unidade}`,
    },
    legend: { textStyle: { color: '#8b949e', fontSize: 11 }, top: 0 },
    grid: { left: 50, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: periodos, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `${v.toFixed(0)} ${unidade}` }, splitLine: { lineStyle: { color: '#21262d' } } },
    series,
  };

  return (
    <div className="chart-card" id="chart-balanco-area">
      <div>
        <div className="chart-card__title">{t('charts.balanco.title')}</div>
        <div className="chart-card__subtitle">{t('charts.balanco.subtitle')}</div>
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 280 }} />
        : <ReactECharts option={option} style={{ height: 280 }} />
      }
    </div>
  );
}
