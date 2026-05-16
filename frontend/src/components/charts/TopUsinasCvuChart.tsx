import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useCvuUsinas } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';
import { CoverageNote } from './CoverageNote';

export function TopUsinasCvuChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useCvuUsinas({ dataInicio, dataFim, subsistema, topN: 10 });

  const data     = response?.items ?? [];
  const coverage = response?.coverage ?? null;
  const cfg = useChartConfig('cvu-usinas');

  const sorted  = [...data].sort((a, b) => a.cvu_medio - b.cvu_medio);
  const unidade = cfg.unidade || 'R$/MWh';

  const markLine = cfg.meta != null ? {
    silent: true,
    data: [{ xAxis: cfg.meta,
      label: { formatter: `Meta: ${cfg.meta.toFixed(cfg.decimais)}`, color: cfg.cor, position: 'insideTopRight' as const },
      lineStyle: { type: 'dashed' as const, color: cfg.cor, width: 1.5 },
    }],
  } : undefined;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: '#1c2128', borderColor: '#30363d',
      textStyle: { color: '#e6edf3', fontSize: 12 },
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number };
        return `${p.name}<br/>CVU médio: <b>${p.value.toFixed(cfg.decimais)} ${unidade}</b>`;
      },
    },
    grid: { left: 160, right: 30, top: 10, bottom: 20 },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `${v.toFixed(0)}` },
      splitLine: { lineStyle: { color: '#21262d' } },
    },
    yAxis: { type: 'category', data: sorted.map((d) => d.nome), axisLabel: { color: '#8b949e', fontSize: 10 } },
    series: [{
      type: 'bar' as const,
      data: sorted.map((d) => ({
        value: d.cvu_medio,
        itemStyle: { color: d.cvu_medio > 500 ? '#f85149' : d.cvu_medio > 350 ? '#e3b341' : '#3fb950' },
      })),
      barMaxWidth: 20,
      ...(markLine ? { markLine } : {}),
    }],
  };

  return (
    <div className="chart-card" id="chart-top-usinas-cvu">
      <div>
        <div className="chart-card__title">{t('charts.cvu.title')}</div>
        <div className="chart-card__subtitle">{t('charts.cvu.subtitle')}</div>
        <CoverageNote coverage={coverage} />
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 300 }} />
        : <ReactECharts option={option} style={{ height: 300 }} />
      }
    </div>
  );
}
