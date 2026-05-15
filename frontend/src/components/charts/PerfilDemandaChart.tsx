import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { usePerfilDemanda } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';

const COLORS: Record<string, string> = { SE: '#58a6ff', S: '#3fb950', NE: '#e3b341', N: '#bc8cff' };
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`);

export function PerfilDemandaChart() {
  const { t } = useTranslation();
  const { dataInicio, subsistema } = useFiltersStore();
  const ano = new Date(dataInicio).getFullYear();
  const { data = [], isLoading } = usePerfilDemanda({ dataInicio, dataFim: dataInicio, subsistema, ano });

  const subs = [...new Set(data.map((d) => d.codigo))].sort();

  const series = subs.map((cod) => ({
    name: cod,
    type: 'line',
    smooth: true,
    data: HOURS.map((_, h) => {
      const row = data.find((d) => d.codigo === cod && d.hora_dia === h);
      return row ? +(row.demanda_media_twh * 1000).toFixed(4) : null;
    }),
    lineStyle: { width: 2 },
    itemStyle: { color: COLORS[cod] ?? '#58a6ff' },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1c2128', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 } },
    legend: { data: subs, textStyle: { color: '#8b949e', fontSize: 11 }, top: 0 },
    grid: { left: 55, right: 20, top: 36, bottom: 28 },
    xAxis: { type: 'category', data: HOURS, axisLabel: { color: '#6e7681', fontSize: 10 }, axisLine: { lineStyle: { color: '#30363d' } } },
    yAxis: { type: 'value', name: 'GWh', axisLabel: { color: '#6e7681', fontSize: 10 }, splitLine: { lineStyle: { color: '#21262d' } } },
    series,
  };

  return (
    <div className="chart-card" id="chart-perfil-demanda">
      <div>
        <div className="chart-card__title">{t('charts.perfil.title')}</div>
        <div className="chart-card__subtitle">{t('charts.perfil.subtitle')}</div>
      </div>
      {isLoading
        ? <div className="skeleton" style={{ height: 260 }} />
        : <ReactECharts option={option} style={{ height: 260 }} />
      }
    </div>
  );
}
