// Stati di un'assegnazione, allineati all'enum Stati del backend (Prisma).
export enum Stato {
  Assegnato = 'Assegnato',
  Completato = 'Completato',
  Scaduto = 'Scaduto',
  Annullato = 'Annullato',
}

// Classi Bootstrap per il badge di stato nella UI.
export const STATO_BADGE: Record<Stato, string> = {
  [Stato.Assegnato]: 'bg-primary',
  [Stato.Completato]: 'bg-success',
  [Stato.Scaduto]: 'bg-danger',
  [Stato.Annullato]: 'bg-secondary',
};
