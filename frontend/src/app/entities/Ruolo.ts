// Ruoli applicativi, allineati all'enum Ruolo del backend (Prisma).
export enum Ruolo {
  DIPENDENTE = 'DIPENDENTE',
  REFERENTE_ACADEMY = 'REFERENTE_ACADEMY',
}

// Etichette leggibili per la UI.
export const RUOLO_LABEL: Record<Ruolo, string> = {
  [Ruolo.DIPENDENTE]: 'Dipendente',
  [Ruolo.REFERENTE_ACADEMY]: 'Referente Academy',
};
