import { useTranslation } from 'react-i18next';
import type { DataCoverage } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface CoverageNoteProps {
  coverage: DataCoverage | null | undefined;
}

/**
 * Anotação inline exibida abaixo do título do gráfico quando os dados
 * não cobrem completamente o período solicitado.
 */
export function CoverageNote({ coverage }: CoverageNoteProps) {
  const { t, i18n } = useTranslation();

  if (!coverage || coverage.cobertura_completa) return null;

  if (!coverage.data_inicio_efetiva || !coverage.data_fim_efetiva) {
    return (
      <span className="coverage-note coverage-note--empty" role="status">
        ⚠️ {t('coverage.note.noData', 'Sem dados para o período selecionado')}
      </span>
    );
  }

  return (
    <span className="coverage-note coverage-note--partial" role="status">
      ⚠️ {t('coverage.note.partial', 'Dados disponíveis de')}
      {' '}
      <strong>{formatDate(coverage.data_inicio_efetiva, i18n.language)}</strong>
      {' '}
      {t('coverage.to', 'até')}
      {' '}
      <strong>{formatDate(coverage.data_fim_efetiva, i18n.language)}</strong>
    </span>
  );
}
