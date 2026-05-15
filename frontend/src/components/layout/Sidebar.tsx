import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LOCALES } from '../../i18n';
import i18n from '../../i18n';

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-mark">I</div>
        <div className="sidebar__logo-info">
          <span className="sidebar__logo-text">Igeos</span>
          <span className="sidebar__logo-sub">ONS Analytics</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label={t('nav.mainMenu')}>
        <span className="sidebar__nav-label">{t('nav.mainMenu')}</span>

        <NavLink
          id="nav-dashboard"
          to="/dashboard"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <span className="nav-link__icon" aria-hidden="true">📊</span>
          {t('nav.dashboard')}
        </NavLink>

        <NavLink
          id="nav-admin"
          to="/admin"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <span className="nav-link__icon" aria-hidden="true">⚙️</span>
          {t('nav.admin')}
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              id={`lang-${locale.code}`}
              className="btn btn--ghost btn--sm"
              style={{
                padding: '2px 6px',
                fontSize: '0.625rem',
                opacity: i18n.language === locale.code ? 1 : 0.5,
              }}
              onClick={() => i18n.changeLanguage(locale.code)}
            >
              {locale.label}
            </button>
          ))}
        </div>
        <span>{t('common.version')}</span>
        {' · '}
        <span>{t('common.dataSource')}</span>
      </div>
    </aside>
  );
}
