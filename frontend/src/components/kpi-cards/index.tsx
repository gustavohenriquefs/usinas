import { useTranslation } from 'react-i18next';
import { useCmoSemanal, useCvuUsinas, useRenovavel, useBalancoHorario } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';

function Skeleton() {
  return <div className="skeleton" style={{ height: 32, borderRadius: 6 }} />;
}

// ── CMO Card ──────────────────────────────────────────────────
export function CmoCard() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useCmoSemanal({ dataInicio, dataFim, subsistema });

  const data   = response?.items ?? [];
  const seData = data.filter((d) => d.codigo === (subsistema ?? 'SE'));
  const latest = seData.at(-1)?.cmo_medio_reais_mwh ?? 0;
  const prev   = seData.at(-2)?.cmo_medio_reais_mwh ?? 0;
  const delta  = prev ? ((latest - prev) / prev) * 100 : 0;

  return (
    <div className="card" id="kpi-card-cmo">
      <div className="card__header">
        <span className="card__title">{t('kpis.cmoCard.title')}</span>
        <span aria-hidden="true">⚡</span>
      </div>
      {isLoading ? <Skeleton /> : (
        <>
          <div className="kpi-value">
            {latest.toFixed(0)}
            <span className="kpi-unit"> {t('units.reaisMwh')}</span>
          </div>
          <span className={`kpi-delta kpi-delta--${delta >= 0 ? 'up' : 'down'}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
          <p className="text-xs text-muted mt-2">{t('kpis.cmoCard.subtitle')}</p>
        </>
      )}
    </div>
  );
}

// ── Renovável Card ────────────────────────────────────────────
export function RenovavelCard() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useRenovavel({ dataInicio, dataFim, subsistema });

  const data   = response?.items ?? [];
  const sinAvg = data.length
    ? data.reduce((s, d) => s + d.pct_renovavel, 0) / data.length
    : 0;

  const getBadge = (v: number) =>
    v >= 80 ? 'green' : v >= 60 ? 'yellow' : 'red';

  return (
    <div className="card" id="kpi-card-renovavel">
      <div className="card__header">
        <span className="card__title">{t('kpis.renovavelCard.title')}</span>
        <span aria-hidden="true">🌱</span>
      </div>
      {isLoading ? <Skeleton /> : (
        <>
          <div className="kpi-value">
            {sinAvg.toFixed(1)}
            <span className="kpi-unit"> {t('units.pct')}</span>
          </div>
          <span className={`kpi-badge kpi-badge--${getBadge(sinAvg)}`}>
            {sinAvg >= 80 ? '✔ Meta atingida' : '⚠ Abaixo da meta'}
          </span>
          <p className="text-xs text-muted mt-2">{t('kpis.renovavelCard.subtitle')}</p>
        </>
      )}
    </div>
  );
}

// ── Carga Card ────────────────────────────────────────────────
export function CargaCard() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema, granularidade } = useFiltersStore();
  const { data: response, isLoading } = useBalancoHorario({ dataInicio, dataFim, subsistema, granularidade });

  const data     = response?.items ?? [];
  const totalGwh = data.reduce((s, d) => s + d.carga_twh, 0) * 1000;

  return (
    <div className="card" id="kpi-card-carga">
      <div className="card__header">
        <span className="card__title">{t('kpis.cargaCard.title')}</span>
        <span aria-hidden="true">🔌</span>
      </div>
      {isLoading ? <Skeleton /> : (
        <>
          <div className="kpi-value">
            {totalGwh.toFixed(0)}
            <span className="kpi-unit"> {t('units.gwh')}</span>
          </div>
          <p className="text-xs text-muted mt-2">{t('kpis.cargaCard.subtitle')}</p>
        </>
      )}
    </div>
  );
}

// ── CVU Card ──────────────────────────────────────────────────
export function CvuCard() {
  const { t } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useCvuUsinas({ dataInicio, dataFim, subsistema });

  const data   = response?.items ?? [];
  const avgCvu = data.length
    ? data.reduce((s, d) => s + d.cvu_medio, 0) / data.length
    : 0;

  const getBadge = (v: number) =>
    v < 350 ? 'green' : v < 500 ? 'yellow' : 'red';

  return (
    <div className="card" id="kpi-card-cvu">
      <div className="card__header">
        <span className="card__title">{t('kpis.cvuCard.title')}</span>
        <span aria-hidden="true">🏭</span>
      </div>
      {isLoading ? <Skeleton /> : (
        <>
          <div className="kpi-value">
            {avgCvu.toFixed(0)}
            <span className="kpi-unit"> {t('units.reaisMwh')}</span>
          </div>
          <span className={`kpi-badge kpi-badge--${getBadge(avgCvu)}`}>
            {getBadge(avgCvu) === 'green' ? '🟢' : getBadge(avgCvu) === 'yellow' ? '🟡' : '🔴'}
            {' '}{getBadge(avgCvu) === 'green' ? 'Baixo' : getBadge(avgCvu) === 'yellow' ? 'Médio' : 'Alto'}
          </span>
          <p className="text-xs text-muted mt-2">{t('kpis.cvuCard.subtitle')}</p>
        </>
      )}
    </div>
  );
}
