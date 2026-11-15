import { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'junior_historian',
    title: 'Junior Historian',
    description: 'Berhasil menyingkap asal-usul kata sejarah dan membuka gerbang The Origin Chamber.',
    conditionLabel: 'Selesaikan Level 1',
    iconKey: 'compass',
  },
  {
    id: 'evidence_hunter',
    title: 'Evidence Hunter',
    description: 'Mampu membedakan sumber primer, sekunder, dan tersier serta menguji relevansinya.',
    conditionLabel: 'Selesaikan Level 2',
    iconKey: 'search',
  },
  {
    id: 'master_researcher',
    title: 'Master Researcher',
    description: 'Menguasai urutan heuristik, kritik eksternal dan internal, interpretasi, serta historiografi.',
    conditionLabel: 'Selesaikan Level 3',
    iconKey: 'flask',
  },
  {
    id: 'dimension_navigator',
    title: 'Dimension Navigator',
    description: 'Mampu memetakan keterkaitan unsur manusia, ruang, dan waktu dalam peristiwa sejarah.',
    conditionLabel: 'Selesaikan Level 4',
    iconKey: 'spark',
  },
  {
    id: 'time_traveler',
    title: 'Time Traveler',
    description: 'Memahami kronologi, periodisasi, kausalitas, dan batasan analogi mesin waktu.',
    conditionLabel: 'Selesaikan Level 5',
    iconKey: 'clock',
  },
  {
    id: 'history_storyteller',
    title: 'History Storyteller',
    description: 'Menguasai perbedaan kedudukan sejarah sebagai peristiwa, kisah, ilmu, dan seni.',
    conditionLabel: 'Selesaikan Level 6',
    iconKey: 'book',
  },
  {
    id: 'chronos_master',
    title: 'Chronos Master',
    description: 'Menyatukan seluruh keping kode sejarah, memecahkan kasus terakhir, dan mengaktifkan Chronos Core.',
    conditionLabel: 'Selesaikan seluruh 7 Level',
    iconKey: 'crown',
  },
];
