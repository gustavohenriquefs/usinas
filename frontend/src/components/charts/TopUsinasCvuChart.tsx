import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { useCvuUsinas } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';

export function TopUsinasCvuChart() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data = [], isLoading } = useCvuUsinas({ dataInicio, dataFim, subsistema, topN: 10 });

  const sorted = [...data].sort((a, b) => a.cvu_medio - b.cvu_medio);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: '#1c2128', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 },
      formatter: (params: unknown[]) => {
        const p = params[0] as { name: string; value: number };
        return `${p.name}<br/>CVU médio: <b>R$${p.value.toFixed(2)}/MWh</b>`;
      },
    },
    grid: { left: 160, right: 30, top: 10, bottom: 20 },
    xAxis: { type: 'value', axisLabel: { color: '#6e7681', fontSize: 10, formatter: (v: number) => `R$${v}` }, splitLine: { lineStyle: { color: '#21262d' } } },
    yAxis: { type: 'category', data: sorted.map((d) => d.nome), axisLabel: { color: '#8b949e', fontSize: 10 } },
    series: [{
      type: 'bar',
      data: sorted.map((d) => ({
        value: d.cvu_medio,
        itemStyle: { color: d.cvu_medio > 500 ? '#f85149' : d.cvu_medio > 350 ? '#e3b341' : '#3fb950' },
      })),
      barMaxWidth: 20,
    }],
  };

  return (
    <div className="chart-card" id="chart-top-usinas-cvu">
      <div>
        <div className="chart-card__title">{t('charts.cvu.title')}</div>
        <div className="chart-card__subtitle">{t('charts.cvu.subtitle')}</div>
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 300 }} />
        : <ReactECharts option={option} style={{ height: 300 }} />
      }
    </div>
  );
}
