import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useCmoSemanal } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';
import { CoverageNote } from './CoverageNote';

export function CmoTemporalChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useCmoSemanal({ dataInicio, dataFim, subsistema });

  const data     = response?.items ?? [];
  const coverage = response?.coverage ?? null;
  const cfg = useChartConfig('cmo-semanal');

  const subsistemas = [...new Set(data.map((d) => d.codigo))].sort();
  const dates       = [...new Set(data.map((d) => d.data))].sort();
  const unidade     = cfg.unidade || 'R$/MWh';

  // Série fantasma: carrega o markLine independente do que o usuário oculta na legenda
  const ghostSeries = cfg.meta != null ? [{
    name: '__meta__',
    type: 'line' as const,
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
    type: 'line' as const,
    smooth: true,
    data: dates.map(
      (d) => data.find((r) => r.codigo === cod && r.data === d)?.cmo_medio_reais_mwh ?? null
    ),
    lineStyle: { width: 2 },
    symbol: 'circle',
    symbolSize: 4,
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1c2128', borderColor: '#30363d',
      textStyle: { color: '#e6edf3', fontSize: 12 },
      valueFormatter: (v: number) => `${v.toFixed(cfg.decimais)} ${unidade}`,
    },
    legend: {
      data: subsistemas, // exclui '__meta__' da legenda
      textStyle: { color: '#8b949e', fontSize: 11 },
      top: 0,
    },
    grid: { left: 60, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: dates, axisLabel: { color: '#6e7681', fontSize: 10, rotate: 30 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `R$${v}` }, splitLine: { lineStyle: { color: '#21262d' } } },
    series: [...dataSeries, ...ghostSeries],
  };

  return (
    <div className="chart-card" id="chart-cmo-temporal">
      <div>
        <div className="chart-card__title">{t('charts.cmoTemporal.title')}</div>
        <div className="chart-card__subtitle">{t('charts.cmoTemporal.subtitle')}</div>
        <CoverageNote coverage={coverage} />
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 280 }} />
        : <ReactECharts option={option} style={{ height: 280 }} />
      }
    </div>
  );
}
