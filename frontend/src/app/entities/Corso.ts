export type Corso = {
  id: number;
  titolo: string;
  descrizione: string | null;
  categoria: string;
  durataOre: number;
  obbligatorio: boolean;
  attivo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Payload per creazione/modifica di un corso.
export type CorsoInput = {
  titolo: string;
  descrizione?: string | null;
  categoria: string;
  durataOre: number;
  obbligatorio?: boolean;
  attivo?: boolean;
};
