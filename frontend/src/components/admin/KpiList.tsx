import { useTranslation } from 'react-i18next';
import { useKpiConfigs, useUpdateKpiConfig } from '../../api/admin';
import type { KpiConfig } from '../../types';

interface KpiListProps {
  onSelect: (kpi: KpiConfig) => void;
  selectedId: number | null;
}

export function KpiList({ onSelect, selectedId }: KpiListProps) {
  const { t } = useTranslation();
  const { data: configs = [], isLoading } = useKpiConfigs();
  const update = useUpdateKpiConfig();

  const sorted = [...configs].sort((a, b) => a.ordem - b.ordem);

  if (isLoading) return <div className="skeleton" style={{ height: 300 }} />;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="flex items-center justify-between mb-4">
        <h3>{t('admin.title')}</h3>
      </div>
      <p className="text-xs text-muted mb-4">{t('admin.subtitle')}</p>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {sorted.map((kpi) => (
          <li
            key={kpi.id}
            id={`kpi-list-item-${kpi.id}`}
            className={`kpi-list-item${selectedId === kpi.id ? ' selected' : ''}`}
            onClick={() => onSelect(kpi)}
            style={{ cursor: 'pointer' }}
          >
            <span
              className={`kpi-list-item__status kpi-list-item__status--${kpi.visivel ? 'on' : 'off'}`}
              aria-hidden="true"
            />
            <span className="kpi-list-item__name truncate">{kpi.titulo}</span>
            <button
              className="btn btn--ghost btn--sm"
              title={kpi.visivel ? t('admin.deactivate') : t('admin.activate')}
              aria-label={kpi.visivel ? t('admin.deactivate') : t('admin.activate')}
              onClick={(e) => {
                e.stopPropagation();
                update.mutate({ id: kpi.id, payload: { visivel: !kpi.visivel } });
              }}
            >
              {kpi.visivel ? '👁' : '🙈'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
