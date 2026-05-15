import { useTranslation } from 'react-i18next';

interface TopBarProps {
  title: string;
  badge?: string;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function TopBar({ title, badge }: TopBarProps) {
  const { t } = useTranslation();

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
      </div>
    </header>
  );
}
