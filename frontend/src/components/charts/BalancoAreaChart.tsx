import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useBalancoHorario } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';

const FONTES = [
  { key: 'hidraulica_twh' as const, colorVar: '--chart-hidraulica',   i18n: 'legend.hidraulica' },
  { key: 'termica_twh'   as const, colorVar: '--chart-termica',      i18n: 'legend.termica' },
  { key: 'eolica_twh'    as const, colorVar: '--chart-eolica',       i18n: 'legend.eolica' },
  { key: 'fotovoltaica_twh' as const, colorVar: '--chart-fotovoltaica', i18n: 'legend.fotovoltaica' },
];

const COLORS = ['#58a6ff','#f85149','#3fb950','#e3b341'];

export function BalancoAreaChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema, granularidade } = useFiltersStore();
  const { data = [], isLoading } = useBalancoHorario({ dataInicio, dataFim, subsistema, granularidade });

  const periodos = [...new Set(data.map((d) => d.periodo))].sort();

  const series = FONTES.map((f, i) => ({
    name: t(f.i18n),
    type: 'bar',
    stack: 'total',
    data: periodos.map(
      (p) => data.filter((d) => d.periodo === p).reduce((s, d) => s + d[f.key], 0)
    ),
    itemStyle: { color: COLORS[i] },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#1c2128', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 } },
    legend: { textStyle: { color: '#8b949e', fontSize: 11 }, top: 0 },
    grid: { left: 50, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: periodos, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `${v.toFixed(0)} TWh` }, splitLine: { lineStyle: { color: '#21262d' } } },
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
