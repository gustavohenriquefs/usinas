import { useTranslation } from 'react-i18next';
import { useCmoSemanal, useCvuUsinas, useRenovavel, useBalancoHorario } from '../../api/kpis';
import { useFiltersStore } from '../../store/filtersStore';
import { formatDate } from '../../utils/formatDate';
import { CoverageNote } from '../charts/CoverageNote';

function Skeleton() {
  return <div className="skeleton" style={{ height: 32, borderRadius: 6 }} />;
}

// ── CMO Card ──────────────────────────────────────────────────
export function CmoCard() {
  const { t, i18n } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useCmoSemanal({ dataInicio, dataFim, subsistema });

  const data   = response?.items ?? [];
  const seData = data.filter((d) => d.codigo === (subsistema ?? 'SE'));
  const latest = seData.at(-1)?.cmo_medio_reais_mwh ?? 0;

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
          <p className="text-xs text-muted mt-2">
            {t('kpis.periodLabel', {
              inicio: formatDate(dataInicio, i18n.language),
              fim: formatDate(dataFim, i18n.language)
            })}
          </p>
          <div className="mt-1">
            <CoverageNote coverage={response?.coverage} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Renovável Card ────────────────────────────────────────────
export function RenovavelCard() {
  const { t, i18n } = useTranslation();
  const { dataInicio, dataFim, subsistema } = useFiltersStore();
  const { data: response, isLoading } = useRenovavel({ dataInicio, dataFim, subsistema });

  const data   = response?.items ?? [];
  const sinAvg = data.length
    ? data.reduce((s, d) => s + d.pct_renovavel, 0) / data.length
    : 0;

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
          <p className="text-xs text-muted mt-2">
            {t('kpis.periodLabel', {
              inicio: formatDate(dataInicio, i18n.language),
              fim: formatDate(dataFim, i18n.language)
            })}
          </p>
          <div className="mt-1">
            <CoverageNote coverage={response?.coverage} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Carga Card ────────────────────────────────────────────────
export function CargaCard() {
  const { t, i18n } = useTranslation();
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
          <p className="text-xs text-muted mt-2">
            {t('kpis.periodLabel', {
              inicio: formatDate(dataInicio, i18n.language),
              fim: formatDate(dataFim, i18n.language)
            })}
          </p>
          <div className="mt-1">
            <CoverageNote coverage={response?.coverage} />
          </div>
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
          <p className="text-xs text-muted mt-2">{t('kpis.cvuCard.subtitle')}</p>
          <div className="mt-1">
            <CoverageNote coverage={response?.coverage} />
          </div>
        </>
      )}
    </div>
  );
}
