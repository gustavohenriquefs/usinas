import { useTranslation } from 'react-i18next';

interface TopBarProps {
  title: string;
  badge?: string;
  showExport?: boolean;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function TopBar({ title, badge, showExport }: TopBarProps) {
  const { t } = useTranslation();

  const handleExport = () => window.print();

  return (
    <header className="topbar">
      <span className="topbar__title">{title}</span>
      {badge && <span className="topbar__badge">{badge}</span>}

      <div className="topbar__right">
        {USE_MOCKS && (
          <div className="topbar__mock-badge" title={t('topbar.mockMode')}>
            <span className="topbar__mock-dot" />
            {t('topbar.mockMode')}
          </div>
        )}

        {showExport && (
          <button
            id="btn-export-report"
            className="btn btn--ghost btn--sm topbar__export-btn"
            onClick={handleExport}
            title={t('topbar.exportReport')}
            aria-label={t('topbar.exportReport')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('topbar.exportReport')}
          </button>
        )}
      </div>
    </header>
  );
}
