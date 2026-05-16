import type { Subsistema, Usina, DatasetCoverage } from '../../types';

export const mockSubsistemas: Subsistema[] = [
  { id: 1, codigo: 'SE', nome: 'Sudeste / Centro-Oeste' },
  { id: 2, codigo: 'S',  nome: 'Sul' },
  { id: 3, codigo: 'NE', nome: 'Nordeste' },
  { id: 4, codigo: 'N',  nome: 'Norte' },
  { id: 5, codigo: 'CO', nome: 'Centro-Oeste' },
];

export const mockUsinas: Usina[] = [
  { id: 1,  nome: 'Itaipu',          id_subsistema: 1, subsistema_codigo: 'SE' },
  { id: 2,  nome: 'Belo Monte',      id_subsistema: 4, subsistema_codigo: 'N'  },
  { id: 3,  nome: 'Jirau',           id_subsistema: 4, subsistema_codigo: 'N'  },
  { id: 4,  nome: 'Santo Antônio',   id_subsistema: 4, subsistema_codigo: 'N'  },
  { id: 5,  nome: 'Tucuruí',         id_subsistema: 4, subsistema_codigo: 'N'  },
  { id: 6,  nome: 'Angra 1',         id_subsistema: 1, subsistema_codigo: 'SE' },
  { id: 7,  nome: 'Angra 2',         id_subsistema: 1, subsistema_codigo: 'SE' },
  { id: 8,  nome: 'Termeletric NE',  id_subsistema: 3, subsistema_codigo: 'NE' },
  { id: 9,  nome: 'Complexo Eólico', id_subsistema: 3, subsistema_codigo: 'NE' },
  { id: 10, nome: 'UTE Mauá 3',      id_subsistema: 2, subsistema_codigo: 'S'  },
];

export const mockCobertura: DatasetCoverage[] = [
  { dataset: 'balanco-horario',  label: 'Balanço de Energia por Subsistema',          data_inicio: '2000-01-01', data_fim: '2024-02-29' },
  { dataset: 'balanco-dessem',   label: 'Balanço de Energia por Subsistema (DESSEM)', data_inicio: '2020-01-01', data_fim: '2024-03-03' },
  { dataset: 'cmo-semanal',      label: 'Custo Marginal de Operação Semanal',         data_inicio: '2005-01-01', data_fim: '2024-03-08' },
  { dataset: 'cmo-semi-horario', label: 'Custo Marginal de Operação Semi-Horário',    data_inicio: '2020-01-01', data_fim: '2024-03-03' },
  { dataset: 'cvu-usinas',       label: 'Custo Variável Unitário das Usinas Térmicas',data_inicio: '2019-12-28', data_fim: '2024-03-02' },
];
