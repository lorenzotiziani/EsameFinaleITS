import { Stato } from './Stato';
import { Corso } from './Corso';

// Dipendente "leggero" incluso nelle assegnazioni (senza password).
export type DipendenteRef = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
};

export type Assegnazione = {
  id: number;
  corsoId: number;
  dipendenteId: number;
  dataAssegnazione: string;
  dataScadenza: string;
  stato: Stato;
  dataCompletamento: string | null;
  corso?: Corso;
  dipendente?: DipendenteRef;
};

// Payload per creazione di un'assegnazione (lo stato iniziale lo decide il backend).
export type AssegnazioneCreateInput = {
  corsoId: number;
  dipendenteId: number;
  dataAssegnazione?: string;
  dataScadenza: string;
};

// Payload per modifica di un'assegnazione.
export type AssegnazioneUpdateInput = {
  corsoId?: number;
  dipendenteId?: number;
  dataAssegnazione?: string;
  dataScadenza?: string;
  stato?: Stato;
  dataCompletamento?: string | null;
};
