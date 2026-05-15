import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar }    from '../components/layout/TopBar';
import { KpiList }   from '../components/admin/KpiList';
import { KpiEditor } from '../components/admin/KpiEditor';
import type { KpiConfig } from '../types';

export function Admin() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<KpiConfig | null>(null);

  return (
    <>
      <TopBar title={t('nav.admin')} />
      <main className="page-body" id="admin-page">
        <div className="admin-layout">
          <KpiList onSelect={setSelected} selectedId={selected?.id ?? null} />
          <KpiEditor kpi={selected} />
        </div>
      </main>
    </>
  );
}
