import { useTranslation } from 'react-i18next';
import { GlobalFilterBar } from '../components/filters/GlobalFilterBar';
import { CmoCard, RenovavelCard, CargaCard, CvuCard } from '../components/kpi-cards';
import { CmoTemporalChart }  from '../components/charts/CmoTemporalChart';
import { BalancoAreaChart }  from '../components/charts/BalancoAreaChart';
import { PerfilDemandaChart } from '../components/charts/PerfilDemandaChart';
import { TopUsinasCvuChart }  from '../components/charts/TopUsinasCvuChart';
import { CmoPatamares }       from '../components/charts/CmoPatamares';
import { IntercambioChart }   from '../components/charts/IntercambioChart';
import { TopBar } from '../components/layout/TopBar';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <>
      <TopBar title={t('nav.dashboard')} badge="SIN" />
      <main className="page-body" id="dashboard-page">
        <GlobalFilterBar />

        <div className="dashboard-grid">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <CmoCard />
            <RenovavelCard />
            <CargaCard />
            <CvuCard />
          </div>

          {/* Charts — row 1: wide + wide */}
          <div className="charts-grid">
            <div className="chart-full">
              <CmoTemporalChart />
            </div>
          </div>

          {/* Charts — row 2 */}
          <div className="charts-grid">
            <BalancoAreaChart />
            <PerfilDemandaChart />
          </div>

          {/* Charts — row 3 */}
          <div className="charts-grid">
            <TopUsinasCvuChart />
            <CmoPatamares />
          </div>

          {/* Charts — row 4: full width */}
          <div className="charts-grid">
            <div className="chart-full">
              <IntercambioChart />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
