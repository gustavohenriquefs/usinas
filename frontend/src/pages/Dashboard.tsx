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
import { useActiveKpiConfigs } from '../api/admin';

// Map de slug → factory de componente
const CHART_FACTORIES: Record<string, () => React.ReactElement> = {
  'cmo-semanal':    () => <CmoTemporalChart />,
  'balanco-horario':() => <BalancoAreaChart />,
  'perfil-demanda': () => <PerfilDemandaChart />,
  'cvu-usinas':     () => <TopUsinasCvuChart />,
  'cmo-patamares':  () => <CmoPatamares />,
  'intercambio':    () => <IntercambioChart />,
};

export function Dashboard() {
  const { t } = useTranslation();
  const { data: activeConfigs, isLoading } = useActiveKpiConfigs();

  // Slugs ativos ordenados
  const activeSlugs = (activeConfigs ?? [])
    .filter((c) => c.visivel)
    .sort((a, b) => a.ordem - b.ordem)
    .map((c) => c.slug);

  // Fallback APENAS enquanto está carregando (isLoading), nunca quando todos estão ocultos
  const slugsToShow = isLoading ? Object.keys(CHART_FACTORIES) : activeSlugs;

  // Separar "wide" (ocupa linha inteira) dos "meio a meio"
  const FULL_WIDTH_SLUGS = new Set(['cmo-semanal', 'intercambio']);

  // Slugs que têm chart factory (exclui slugs de cards que não são gráficos)
  const knownSlugs = new Set(Object.keys(CHART_FACTORIES));
  const fullWidthCharts = slugsToShow.filter((s) => FULL_WIDTH_SLUGS.has(s) && knownSlugs.has(s));
  const halfWidthCharts = slugsToShow.filter((s) => !FULL_WIDTH_SLUGS.has(s) && knownSlugs.has(s));

  // Agrupa half-width em pares de 2
  const halfPairs: string[][] = [];
  for (let i = 0; i < halfWidthCharts.length; i += 2) {
    halfPairs.push(halfWidthCharts.slice(i, i + 2));
  }

  return (
    <>
      <TopBar title={t('nav.dashboard')} badge="SIN" showExport />
      <main className="page-body" id="dashboard-page">
        <GlobalFilterBar />

        <div className="dashboard-grid">
          {/* KPI Cards — always visible */}
          <div className="kpi-grid">
            <CmoCard />
            <RenovavelCard />
            <CargaCard />
            <CvuCard />
          </div>

          {/* Full-width charts first */}
          {fullWidthCharts.map((slug) => {
            const Factory = CHART_FACTORIES[slug];
            return Factory ? (
              <div key={slug} className="charts-grid">
                <div className="chart-full"><Factory /></div>
              </div>
            ) : null;
          })}

          {/* Half-width charts in pairs */}
          {halfPairs.map((pair, idx) => (
            <div key={idx} className="charts-grid">
              {pair.map((slug) => {
                const Factory = CHART_FACTORIES[slug];
                return Factory ? <Factory key={slug} /> : null;
              })}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
