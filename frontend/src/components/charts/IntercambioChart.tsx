import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useIntercambio } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';

const COLORS: Record<string, string> = { SE: '#58a6ff', S: '#3fb950', NE: '#e3b341', N: '#bc8cff', CO: '#39d353' };

export function IntercambioChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, granularidade } = useFiltersStore();
  const { data = [], isLoading } = useIntercambio({ dataInicio, dataFim, granularidade });

  const periodos    = [...new Set(data.map((d) => d.periodo))].sort();
  const subsistemas = [...new Set(data.map((d) => d.codigo))].sort();

  const series = subsistemas.map((cod) => ({
    name: cod,
    type: 'bar',
    stack: 'intercambio',
    data: periodos.map(
      (p) => data.find((d) => d.codigo === cod && d.periodo === p)?.intercambio_twh ?? 0
    ),
    itemStyle: { color: COLORS[cod] ?? '#58a6ff' },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#1c2128', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 } },
    legend: { data: subsistemas, textStyle: { color: '#8b949e', fontSize: 11 }, top: 0 },
    grid: { left: 55, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: periodos, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `${v.toFixed(1)} TWh` }, splitLine: { lineStyle: { color: '#21262d' } } },
    series,
  };

  return (
    <div className="chart-card" id="chart-intercambio">
      <div>
        <div className="chart-card__title">{t('charts.intercambio.title')}</div>
        <div className="chart-card__subtitle">{t('charts.intercambio.subtitle')}</div>
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 260 }} />
        : <ReactECharts option={option} style={{ height: 260 }} />
      }
    </div>
  );
}
