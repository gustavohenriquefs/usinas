import type {
  CmoSemanalItem,
  BalancoHorarioItem,
  RenovavelItem,
  CvuUsinaItem,
  PerfilDemandaItem,
  IntercambioItem,
} from '../../types';

// ── GET /api/kpis/cmo-semanal ────────────────────────────────
export const mockCmoSemanal: CmoSemanalItem[] = [
  { codigo: 'SE', data: '2024-01-07', cmo_medio_reais_mwh: 187.34, cmo_carga_leve_reais_mwh: 142.10, cmo_carga_media_reais_mwh: 195.20, cmo_carga_pesada_reais_mwh: 224.80 },
  { codigo: 'SE', data: '2024-01-14', cmo_medio_reais_mwh: 201.55, cmo_carga_leve_reais_mwh: 158.30, cmo_carga_media_reais_mwh: 208.40, cmo_carga_pesada_reais_mwh: 238.50 },
  { codigo: 'SE', data: '2024-01-21', cmo_medio_reais_mwh: 195.20, cmo_carga_leve_reais_mwh: 151.80, cmo_carga_media_reais_mwh: 202.10, cmo_carga_pesada_reais_mwh: 231.70 },
  { codigo: 'SE', data: '2024-01-28', cmo_medio_reais_mwh: 178.90, cmo_carga_leve_reais_mwh: 136.50, cmo_carga_media_reais_mwh: 185.60, cmo_carga_pesada_reais_mwh: 214.20 },
  { codigo: 'SE', data: '2024-02-04', cmo_medio_reais_mwh: 165.40, cmo_carga_leve_reais_mwh: 124.20, cmo_carga_media_reais_mwh: 171.30, cmo_carga_pesada_reais_mwh: 198.60 },
  { codigo: 'SE', data: '2024-02-11', cmo_medio_reais_mwh: 210.80, cmo_carga_leve_reais_mwh: 167.90, cmo_carga_media_reais_mwh: 218.40, cmo_carga_pesada_reais_mwh: 252.30 },
  { codigo: 'SE', data: '2024-02-18', cmo_medio_reais_mwh: 223.60, cmo_carga_leve_reais_mwh: 180.10, cmo_carga_media_reais_mwh: 231.80, cmo_carga_pesada_reais_mwh: 268.40 },
  { codigo: 'SE', data: '2024-02-25', cmo_medio_reais_mwh: 245.30, cmo_carga_leve_reais_mwh: 198.70, cmo_carga_media_reais_mwh: 254.20, cmo_carga_pesada_reais_mwh: 294.50 },
  { codigo: 'SE', data: '2024-03-03', cmo_medio_reais_mwh: 232.10, cmo_carga_leve_reais_mwh: 185.40, cmo_carga_media_reais_mwh: 240.60, cmo_carga_pesada_reais_mwh: 278.90 },
  { codigo: 'SE', data: '2024-03-10', cmo_medio_reais_mwh: 218.70, cmo_carga_leve_reais_mwh: 172.30, cmo_carga_media_reais_mwh: 226.40, cmo_carga_pesada_reais_mwh: 262.10 },
  { codigo: 'SE', data: '2024-03-17', cmo_medio_reais_mwh: 198.50, cmo_carga_leve_reais_mwh: 155.20, cmo_carga_media_reais_mwh: 205.80, cmo_carga_pesada_reais_mwh: 238.40 },
  { codigo: 'SE', data: '2024-03-24', cmo_medio_reais_mwh: 176.30, cmo_carga_leve_reais_mwh: 133.90, cmo_carga_media_reais_mwh: 183.10, cmo_carga_pesada_reais_mwh: 211.70 },
  { codigo: 'S',  data: '2024-01-07', cmo_medio_reais_mwh: 154.20, cmo_carga_leve_reais_mwh: 118.30, cmo_carga_media_reais_mwh: 160.50, cmo_carga_pesada_reais_mwh: 186.80 },
  { codigo: 'S',  data: '2024-01-14', cmo_medio_reais_mwh: 168.40, cmo_carga_leve_reais_mwh: 130.20, cmo_carga_media_reais_mwh: 175.10, cmo_carga_pesada_reais_mwh: 203.40 },
  { codigo: 'S',  data: '2024-01-21', cmo_medio_reais_mwh: 162.80, cmo_carga_leve_reais_mwh: 125.70, cmo_carga_media_reais_mwh: 169.30, cmo_carga_pesada_reais_mwh: 196.50 },
  { codigo: 'S',  data: '2024-01-28', cmo_medio_reais_mwh: 145.60, cmo_carga_leve_reais_mwh: 110.40, cmo_carga_media_reais_mwh: 151.20, cmo_carga_pesada_reais_mwh: 175.80 },
  { codigo: 'NE', data: '2024-01-07', cmo_medio_reais_mwh: 220.50, cmo_carga_leve_reais_mwh: 175.80, cmo_carga_media_reais_mwh: 228.40, cmo_carga_pesada_reais_mwh: 264.60 },
  { codigo: 'NE', data: '2024-01-14', cmo_medio_reais_mwh: 238.90, cmo_carga_leve_reais_mwh: 192.40, cmo_carga_media_reais_mwh: 247.60, cmo_carga_pesada_reais_mwh: 286.80 },
  { codigo: 'NE', data: '2024-01-21', cmo_medio_reais_mwh: 245.20, cmo_carga_leve_reais_mwh: 198.70, cmo_carga_media_reais_mwh: 254.10, cmo_carga_pesada_reais_mwh: 294.30 },
  { codigo: 'N',  data: '2024-01-07', cmo_medio_reais_mwh: 142.30, cmo_carga_leve_reais_mwh: 108.50, cmo_carga_media_reais_mwh: 148.10, cmo_carga_pesada_reais_mwh: 171.80 },
  { codigo: 'N',  data: '2024-01-14', cmo_medio_reais_mwh: 158.70, cmo_carga_leve_reais_mwh: 122.30, cmo_carga_media_reais_mwh: 165.20, cmo_carga_pesada_reais_mwh: 191.40 },
];

// ── GET /api/kpis/balanco-horario ────────────────────────────
export const mockBalancoHorario: BalancoHorarioItem[] = [
  { codigo: 'SE', periodo: '2024-01', hidraulica_twh: 42.5,  termica_twh: 12.3, eolica_twh: 3.8,  fotovoltaica_twh: 5.2,  carga_twh: 61.8, intercambio_twh: 2.0 },
  { codigo: 'SE', periodo: '2024-02', hidraulica_twh: 38.2,  termica_twh: 18.7, eolica_twh: 4.1,  fotovoltaica_twh: 5.8,  carga_twh: 64.2, intercambio_twh: 2.6 },
  { codigo: 'SE', periodo: '2024-03', hidraulica_twh: 44.8,  termica_twh: 10.5, eolica_twh: 3.9,  fotovoltaica_twh: 6.1,  carga_twh: 63.1, intercambio_twh: 2.2 },
  { codigo: 'SE', periodo: '2024-04', hidraulica_twh: 50.3,  termica_twh: 8.2,  eolica_twh: 4.3,  fotovoltaica_twh: 5.9,  carga_twh: 65.7, intercambio_twh: 3.0 },
  { codigo: 'S',  periodo: '2024-01', hidraulica_twh: 14.2,  termica_twh: 3.1,  eolica_twh: 8.7,  fotovoltaica_twh: 0.8,  carga_twh: 24.8, intercambio_twh: -2.0 },
  { codigo: 'S',  periodo: '2024-02', hidraulica_twh: 12.8,  termica_twh: 4.5,  eolica_twh: 9.2,  fotovoltaica_twh: 0.9,  carga_twh: 24.9, intercambio_twh: -2.5 },
  { codigo: 'S',  periodo: '2024-03', hidraulica_twh: 15.6,  termica_twh: 2.8,  eolica_twh: 8.4,  fotovoltaica_twh: 1.1,  carga_twh: 25.3, intercambio_twh: -2.4 },
  { codigo: 'NE', periodo: '2024-01', hidraulica_twh: 5.8,   termica_twh: 6.3,  eolica_twh: 14.2, fotovoltaica_twh: 9.1,  carga_twh: 32.4, intercambio_twh: -3.0 },
  { codigo: 'NE', periodo: '2024-02', hidraulica_twh: 6.2,   termica_twh: 7.8,  eolica_twh: 15.6, fotovoltaica_twh: 9.8,  carga_twh: 34.1, intercambio_twh: -5.3 },
  { codigo: 'NE', periodo: '2024-03', hidraulica_twh: 7.1,   termica_twh: 5.4,  eolica_twh: 16.8, fotovoltaica_twh: 10.5, carga_twh: 35.2, intercambio_twh: -4.6 },
  { codigo: 'N',  periodo: '2024-01', hidraulica_twh: 18.6,  termica_twh: 1.2,  eolica_twh: 0.3,  fotovoltaica_twh: 0.4,  carga_twh: 17.5, intercambio_twh: 3.0 },
  { codigo: 'N',  periodo: '2024-02', hidraulica_twh: 17.3,  termica_twh: 1.8,  eolica_twh: 0.4,  fotovoltaica_twh: 0.5,  carga_twh: 16.8, intercambio_twh: 3.2 },
];

// ── GET /api/kpis/renovavel ──────────────────────────────────
export const mockRenovavel: RenovavelItem[] = [
  { codigo: 'N',  pct_renovavel: 95.8 },
  { codigo: 'S',  pct_renovavel: 88.4 },
  { codigo: 'NE', pct_renovavel: 85.2 },
  { codigo: 'SE', pct_renovavel: 79.6 },
  { codigo: 'CO', pct_renovavel: 82.1 },
];

// ── GET /api/kpis/cvu-usinas ─────────────────────────────────
export const mockCvuUsinas: CvuUsinaItem[] = [
  { nome: 'UTE Mauá 3',           codigo: 'S',  cvu_medio: 652.40, cvu_min: 580.20, cvu_max: 724.50 },
  { nome: 'UTE Angra 2',          codigo: 'SE', cvu_medio: 584.30, cvu_min: 520.10, cvu_max: 648.70 },
  { nome: 'UTE Suape II',         codigo: 'NE', cvu_medio: 498.60, cvu_min: 445.30, cvu_max: 552.80 },
  { nome: 'UTE Termopernambuco',  codigo: 'NE', cvu_medio: 462.80, cvu_min: 412.40, cvu_max: 513.20 },
  { nome: 'UTE Porto do Itaqui',  codigo: 'NE', cvu_medio: 425.10, cvu_min: 378.60, cvu_max: 471.40 },
  { nome: 'UTE Pecém I',          codigo: 'NE', cvu_medio: 398.40, cvu_min: 352.10, cvu_max: 444.70 },
  { nome: 'UTE Ibirité',          codigo: 'SE', cvu_medio: 372.60, cvu_min: 328.90, cvu_max: 416.30 },
  { nome: 'UTE Goiás',            codigo: 'CO', cvu_medio: 348.20, cvu_min: 305.70, cvu_max: 390.80 },
  { nome: 'UTE Jorge Lacerda',    codigo: 'S',  cvu_medio: 318.50, cvu_min: 278.30, cvu_max: 358.60 },
  { nome: 'UTE Candiota',         codigo: 'S',  cvu_medio: 289.70, cvu_min: 252.40, cvu_max: 327.10 },
];

// ── GET /api/kpis/perfil-demanda ─────────────────────────────
export const mockPerfilDemanda: PerfilDemandaItem[] = [
  ...Array.from({ length: 24 }, (_, h) => ({
    codigo: 'SE',
    hora_dia: h,
    demanda_media_twh:
      h < 6  ? 0.038 + Math.random() * 0.004 :
      h < 9  ? 0.052 + (h - 6) * 0.008 :
      h < 12 ? 0.072 + Math.random() * 0.006 :
      h < 14 ? 0.068 + Math.random() * 0.005 :
      h < 18 ? 0.074 + Math.random() * 0.006 :
      h < 22 ? 0.078 + (21 - h) * 0.004 :
               0.048 + Math.random() * 0.004,
  })),
  ...Array.from({ length: 24 }, (_, h) => ({
    codigo: 'NE',
    hora_dia: h,
    demanda_media_twh:
      h < 6  ? 0.018 + Math.random() * 0.002 :
      h < 9  ? 0.026 + (h - 6) * 0.004 :
      h < 12 ? 0.038 + Math.random() * 0.003 :
      h < 18 ? 0.040 + Math.random() * 0.003 :
      h < 22 ? 0.042 + (21 - h) * 0.002 :
               0.024 + Math.random() * 0.002,
  })),
];

// ── GET /api/kpis/intercambio ────────────────────────────────
export const mockIntercambio: IntercambioItem[] = [
  { codigo: 'SE', periodo: '2024-01', intercambio_twh: 2.0  },
  { codigo: 'SE', periodo: '2024-02', intercambio_twh: 2.6  },
  { codigo: 'SE', periodo: '2024-03', intercambio_twh: 2.2  },
  { codigo: 'SE', periodo: '2024-04', intercambio_twh: 3.0  },
  { codigo: 'S',  periodo: '2024-01', intercambio_twh: -2.0 },
  { codigo: 'S',  periodo: '2024-02', intercambio_twh: -2.5 },
  { codigo: 'S',  periodo: '2024-03', intercambio_twh: -2.4 },
  { codigo: 'S',  periodo: '2024-04', intercambio_twh: -1.8 },
  { codigo: 'NE', periodo: '2024-01', intercambio_twh: -3.0 },
  { codigo: 'NE', periodo: '2024-02', intercambio_twh: -5.3 },
  { codigo: 'NE', periodo: '2024-03', intercambio_twh: -4.6 },
  { codigo: 'NE', periodo: '2024-04', intercambio_twh: -3.9 },
  { codigo: 'N',  periodo: '2024-01', intercambio_twh: 3.0  },
  { codigo: 'N',  periodo: '2024-02', intercambio_twh: 3.2  },
  { codigo: 'N',  periodo: '2024-03', intercambio_twh: 2.8  },
  { codigo: 'N',  periodo: '2024-04', intercambio_twh: 3.1  },
];
