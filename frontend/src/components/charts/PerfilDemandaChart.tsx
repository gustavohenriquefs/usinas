import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { usePerfilDemanda } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';
import { CoverageNote } from './CoverageNote';

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`);

export function PerfilDemandaChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = usePerfilDemanda({ dataInicio, dataFim, subsistema });

  const data     = response?.items ?? [];
  const coverage = response?.coverage ?? null;
  const cfg = useChartConfig('perfil-demanda');

  const subs    = [...new Set(data.map((d) => d.codigo))].sort();
  const unidade = cfg.unidade || 'GWh';

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

  const dataSeries = subs.map((cod) => ({
    name: cod,
    type: 'line' as const,
    smooth: true,
    data: HOURS.map((_, h) => {
      const row = data.find((d) => d.codigo === cod && d.hora_dia === h);
      return row ? +(row.demanda_media_twh * 1000).toFixed(cfg.decimais) : null;
    }),
    lineStyle: { width: 2 },
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
      data: subs, // exclui '__meta__' da legenda
      textStyle: { color: '#8b949e', fontSize: 11 },
      top: 0,
    },
    grid: { left: 55, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: HOURS, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', name: unidade, axisLabel: { color: '#6e7681', fontSize: 10 }, splitLine: { lineStyle: { color: '#21262d' } } },
    series: [...dataSeries, ...ghostSeries],
  };

  return (
    <div className="chart-card" id="chart-perfil-demanda">
      <div>
        <div className="chart-card__title">{t('charts.perfil.title')}</div>
        <div className="chart-card__subtitle">{t('charts.perfil.subtitle')}</div>
        <CoverageNote coverage={coverage} />
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 260 }} />
        : <ReactECharts option={option} style={{ height: 260 }} />
      }
    </div>
  );
}
