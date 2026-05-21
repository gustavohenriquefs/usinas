import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFiltersStore } from '../../store/filtersStore';
import { useSubsistemas } from '../../api/meta';
import { CoverageWarning } from './CoverageWarning';
import type { ScenarioKey } from '../../types';

const SCENARIOS: Array<{ key: NonNullable<ScenarioKey>; emoji: string; i18nKey: string }> = [
  { key: 'drought',      emoji: '🌧', i18nKey: 'scenarios.drought' },
  { key: 'thermalCrisis',emoji: '🔥', i18nKey: 'scenarios.thermalCrisis' },
  { key: 'peakHour',     emoji: '⚡', i18nKey: 'scenarios.peakHour' },
];

const GRANULARIDADES = [
  { value: 'day',   i18nKey: 'filters.granDay' },
  { value: 'month', i18nKey: 'filters.granMonth' },
  { value: 'year',  i18nKey: 'filters.granYear' },
] as const;

export function GlobalFilterBar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    dataInicio: appliedDataInicio,
    dataFim:    appliedDataFim,   // período aplicado — só muda após "Aplicar Filtros"
    draft,
    setDraftDateRange, setDraftSubsistema, setDraftGranularidade, applyDraftScenario,
    applyFilters,
  } = useFiltersStore();

  const { dataInicio, dataFim, subsistema, granularidade, scenario } = draft;
  const { data: subsistemas = [] } = useSubsistemas();

  return (
    <div className="filter-bar" role="search" aria-label="Filtros globais">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('filters.title', 'Filtros de Análise')}
        </span>
        <button 
          className="btn btn--secondary btn--sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? t('filters.show', 'Mostrar') : t('filters.hide', 'Ocultar')}
        </button>
      </div>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', width: '100%', alignItems: 'center', marginTop: '8px' }}>
          {/* Period */}
          <div className="filter-bar__section">
            <span className="filter-label">{t('filters.period')}</span>
            <input
              id="filter-date-inicio"
              type="date"
              className="input"
              value={dataInicio}
              max={dataFim}
              onChange={(e) => setDraftDateRange(e.target.value, dataFim)}
              aria-label={t('filters.from')}
            />
            <span className="text-muted text-xs">→</span>
            <input
              id="filter-date-fim"
              type="date"
              className="input"
              value={dataFim}
              min={dataInicio}
              onChange={(e) => setDraftDateRange(dataInicio, e.target.value)}
              aria-label={t('filters.to')}
            />
          </div>

          <div className="filter-bar__divider" />

          {/* Granularidade */}
          <div className="filter-bar__section">
            <span className="filter-label">{t('filters.granularity')}</span>
            <div className="toggle-group" role="group" aria-label={t('filters.granularity')}>
              {GRANULARIDADES.map((g) => (
                <button
                  key={g.value}
                  id={`filter-gran-${g.value}`}
                  className={`toggle-btn${granularidade === g.value ? ' active' : ''}`}
                  onClick={() => setDraftGranularidade(g.value)}
                >
                  {t(g.i18nKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-bar__divider" />

          {/* Subsistema */}
          <div className="filter-bar__section">
            <span className="filter-label">{t('filters.subsistema')}</span>
            <select
              id="filter-subsistema"
              className="select"
              value={subsistema ?? ''}
              onChange={(e) => setDraftSubsistema(e.target.value || null)}
              aria-label={t('filters.subsistema')}
            >
              <option value="">{t('filters.allSubsistemas')}</option>
              {subsistemas.map((s) => (
                <option key={s.id} value={s.codigo}>
                  {s.codigo} — {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-bar__divider" />

          {/* Cenários Rápidos */}
          <div className="filter-bar__section">
            <span className="filter-label">{t('filters.scenarios')}</span>
            <div className="scenario-chips">
              {SCENARIOS.map(({ key, emoji, i18nKey }) => (
                <button
                  key={key}
                  id={`scenario-${key}`}
                  className={`scenario-chip${scenario === key ? ' active' : ''}`}
                  onClick={() => applyDraftScenario(key)}
                  title={t(i18nKey)}
                >
                  {emoji} {t(i18nKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-bar__divider" />

          {/* Aplicar */}
          <div className="filter-bar__section" style={{ marginLeft: 'auto' }}>
            <button
              id="btn-apply-filters"
              className="btn btn--primary"
              onClick={applyFilters}
            >
              {t('filters.apply')}
            </button>
          </div>
        </div>
      )}

      {/* Aviso de cobertura — usa período aplicado, não o draft */}
      <CoverageWarning dataInicio={appliedDataInicio} dataFim={appliedDataFim} />
    </div>
  );
}
