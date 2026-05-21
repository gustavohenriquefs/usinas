import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useIntercambio } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';
import { CoverageNote } from './CoverageNote';

export function IntercambioChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim } = useFiltersStore();
  const { data: response, isLoading } = useIntercambio({ dataInicio, dataFim });

  const data     = response?.items ?? [];
  const coverage = response?.coverage ?? null;
  const cfg = useChartConfig('intercambio');

  const periodos    = [...new Set(data.map((d) => d.periodo))].sort();
  const subsistemas = [...new Set(data.map((d) => d.codigo))].sort();
  const unidade     = cfg.unidade || 'TWh';

  // Série fantasma: carrega o markLine independente do que o usuário oculta na legenda
  const ghostSeries = cfg.meta != null ? [{
    name: '__meta__',
    type: 'bar' as const,
    data: [],
    silent: true,
    legendHoverLink: false,
    markLine: {
      silent: true,
      symbol: ['none', 'arrow'],
      data: [{ yAxis: cfg.meta,
        label: { formatter: `Meta: ${cfg.meta.toFixed(cfg.decimais)} ${unidade}`, color: cfg.cor },
        lineStyle: { type: 'dashed' as const, color: cfg.cor, width: 1.5 },
      }],
    },
  }] : [];

  const dataSeries = subsistemas.map((cod) => ({
    name: cod,
    type: 'bar' as const,
    stack: 'intercambio',
    data: periodos.map(
      (p) => data.find((d) => d.codigo === cod && d.periodo === p)?.intercambio_twh ?? 0
    ),
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: '#1c2128', borderColor: '#30363d',
      textStyle: { color: '#e6edf3', fontSize: 12 },
      valueFormatter: (v: number) => `${v.toFixed(cfg.decimais)} ${unidade}`,
    },
    legend: {
      data: subsistemas, // exclui '__meta__' da legenda
      textStyle: { color: '#8b949e', fontSize: 11 },
      top: 0,
    },
    grid: { left: 55, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: periodos, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `${v.toFixed(1)} ${unidade}` }, splitLine: { lineStyle: { color: '#21262d' } } },
    series: [...dataSeries, ...ghostSeries],
  };

  return (
    <div className="chart-card" id="chart-intercambio">
      <div>
        <div className="chart-card__title">{t('charts.intercambio.title')}</div>
        <div className="chart-card__subtitle">{t('charts.intercambio.subtitle')}</div>
        <CoverageNote coverage={coverage} />
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 260 }} />
        : <ReactECharts option={option} style={{ height: 260 }} />
      }
    </div>
  );
}
