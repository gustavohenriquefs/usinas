import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useCmoSemanal } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { useChartConfig } from '../../hooks/useChartConfig';

// Semantic patamar colors — fixed, not overridable by cfg.cor
const PATAMAR_COLORS = { leve: '#3fb950', medio: '#e3b341', pesado: '#f85149' };

export function CmoPatamares() {
  const { t } = useTranslation();
  const { dataInicio, dataFim } = useFiltersStore();
  const { data = [], isLoading } = useCmoSemanal({ dataInicio, dataFim });
  const cfg = useChartConfig('cmo-patamares');

  const subsistemas = [...new Set(data.map((d) => d.codigo))].sort();
  const unidade = cfg.unidade || 'R$/MWh';

  const chartData = subsistemas.map((cod) => {
    const rows = data.filter((d) => d.codigo === cod);
    const avg = (key: keyof typeof rows[0]) =>
      rows.reduce((s, d) => s + (d[key] as number), 0) / (rows.length || 1);
    return {
      subsistema: cod,
      [t('legend.leve')]:  +avg('cmo_carga_leve_reais_mwh').toFixed(cfg.decimais),
      [t('legend.medio')]: +avg('cmo_carga_media_reais_mwh').toFixed(cfg.decimais),
      [t('legend.pesado')]:+avg('cmo_carga_pesada_reais_mwh').toFixed(cfg.decimais),
    };
  });

  const DARK = { background: 'transparent', color: '#8b949e', fontSize: 11 };

  return (
    <div className="chart-card" id="chart-cmo-patamares">
      <div>
        <div className="chart-card__title">{t('charts.patamares.title')}</div>
        <div className="chart-card__subtitle">{t('charts.patamares.subtitle')}</div>
      </div>
      {isLoading ? (
        <div className="skeleton" style={{ height: 260 }} />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
            <XAxis dataKey="subsistema" tick={{ fill: '#6e7681', fontSize: 11 }} axisLine={{ stroke: '#30363d' }} />
            <YAxis tick={{ fill: '#6e7681', fontSize: 10 }} axisLine={{ stroke: '#30363d' }} tickFormatter={(v) => `R$${v}`} />
            <Tooltip
              contentStyle={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: 8 }}
              labelStyle={DARK}
              itemStyle={{ color: '#e6edf3', fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(cfg.decimais)} ${unidade}`]}
            />
            <Legend wrapperStyle={{ color: '#8b949e', fontSize: 11 }} />
            {/* cfg.cor is the accent — used only for the ReferenceLine */}
            {cfg.meta != null && (
              <ReferenceLine
                y={cfg.meta}
                stroke={cfg.cor}
                strokeDasharray="6 3"
                label={{ value: `Meta: ${cfg.meta}`, fill: cfg.cor, fontSize: 10, position: 'insideTopRight' }}
              />
            )}
            <Bar dataKey={t('legend.leve')}   fill={PATAMAR_COLORS.leve}   radius={[3,3,0,0]} />
            <Bar dataKey={t('legend.medio')}  fill={PATAMAR_COLORS.medio}  radius={[3,3,0,0]} />
            <Bar dataKey={t('legend.pesado')} fill={PATAMAR_COLORS.pesado} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
