// Riga del riepilogo statistiche academy (per mese e categoria).
export type StatisticaRow = {
  mese: string;
  categoria: string;
  numeroAssegnazioni: number;
  numeroCompletamenti: number;
  percentualeCompletamento: number;
};

// Filtri applicabili al riepilogo.
export type StatisticheFilters = {
  mese?: string;
  categoria?: string;
  dipendenteId?: number;
};
