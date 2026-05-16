import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCobertura } from '../../api/meta';
import type { DatasetCoverage } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface CoverageWarningProps {
  dataInicio: string;
  dataFim: string;
}

/**
 * Compara o período selecionado com a cobertura real de cada dataset.
 * Exibe um aviso discreto listando quais gráficos podem não ter dados
 * para o intervalo escolhido — sem bloquear a interação.
 */
export function CoverageWarning({ dataInicio, dataFim }: CoverageWarningProps) {
  const { t, i18n } = useTranslation();
  const { data: cobertura = [] } = useCobertura();
  const [isExpanded, setIsExpanded] = useState(false);

  const fmt = (d: string) => formatDate(d, i18n.language);

  const outOfRange = cobertura.filter((c: DatasetCoverage) => {
    const startsAfter = dataInicio > c.data_fim;
    const endsBefore  = dataFim < c.data_inicio;
    return startsAfter || endsBefore;
  });

  const partial = cobertura.filter((c: DatasetCoverage) => {
    if (outOfRange.includes(c)) return false;
    const startsBefore = dataInicio < c.data_inicio;
    const endsAfter    = dataFim > c.data_fim;
    return startsBefore || endsAfter;
  });

  if (outOfRange.length + partial.length === 0) return null;

  return (
    <div
      className="coverage-warning"
      role="status"
      aria-live="polite"
      aria-label={t('coverage.ariaLabel', 'Aviso de cobertura de dados')}
    >
      <span className="coverage-warning__icon" aria-hidden="true">ℹ️</span>

      <div className="coverage-warning__body" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="coverage-warning__title" style={{ margin: 0 }}>
            {outOfRange.length > 0
              ? t('coverage.noData', 'Atenção: alguns gráficos podem não ter dados para o período selecionado.')
              : t('coverage.partialData', 'Atenção: dados parciais para o período selecionado.')}
          </span>
          <button
            className="btn btn--secondary btn--sm"
            style={{ padding: '2px 8px', fontSize: '0.6875rem' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('filters.hide', 'Ocultar') : t('coverage.showDetails', 'Ver detalhes')}
          </button>
        </div>

        {isExpanded && (
          <div style={{ marginTop: '8px' }}>
            {outOfRange.length > 0 && (
              <div>
                <span className="coverage-warning__title" style={{ fontSize: '0.75rem' }}>
                  {t('coverage.noDataList', 'Sem dados para o período:')}
                </span>
                <ul className="coverage-warning__list">
                  {outOfRange.map((c) => (
                    <li key={c.dataset}>
                      <strong>{c.label}</strong>
                      {' — '}
                      {t('coverage.available', 'disponível de')}
                      {' '}
                      <code>{fmt(c.data_inicio)}</code>
                      {' '}
                      {t('coverage.to', 'até')}
                      {' '}
                      <code>{fmt(c.data_fim)}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {partial.length > 0 && (
              <div style={{ marginTop: outOfRange.length > 0 ? 8 : 0 }}>
                <span className="coverage-warning__title coverage-warning__title--partial" style={{ fontSize: '0.75rem' }}>
                  {t('coverage.partialDataList', 'Dados parciais para o período:')}
                </span>
                <ul className="coverage-warning__list">
                  {partial.map((c) => (
                    <li key={c.dataset}>
                      <strong>{c.label}</strong>
                      {' — '}
                      {t('coverage.available', 'disponível de')}
                      {' '}
                      <code>{fmt(c.data_inicio)}</code>
                      {' '}
                      {t('coverage.to', 'até')}
                      {' '}
                      <code>{fmt(c.data_fim)}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
