import { Component, inject, OnInit } from '@angular/core';
import { AssegnazioniService } from '../../services/assegnazioni.service';
import { Assegnazione } from '../../entities/Assegnazione';
import { Stato, STATO_BADGE } from '../../entities/Stato';

type FiltroScadenza = '' | 'scadute' | 'prossime30';

@Component({
  selector: 'app-miei-corsi',
  standalone: false,
  templateUrl: './miei-corsi.component.html',
})
export class MieiCorsiComponent implements OnInit {
  private assegnazioniSrv = inject(AssegnazioniService);

  assegnazioni: Assegnazione[] = [];
  loading = false;
  error = '';
  message = '';

  // Filtri (applicati lato client sul dataset del dipendente).
  filtroStato: Stato | '' = '';
  filtroCategoria = '';
  filtroScadenza: FiltroScadenza = '';

  expandedId: number | null = null;

  readonly Stato = Stato;
  readonly STATO_BADGE = STATO_BADGE;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.assegnazioniSrv.list().subscribe({
      next: (data) => {
        this.assegnazioni = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.extractError(err);
        this.loading = false;
      },
    });
  }

  get categorie(): string[] {
    const set = new Set<string>();
    for (const a of this.assegnazioni) {
      if (a.corso?.categoria) {
        set.add(a.corso.categoria);
      }
    }
    return Array.from(set).sort();
  }

  get filtrate(): Assegnazione[] {
    const now = Date.now();
    const in30 = now + 30 * 24 * 60 * 60 * 1000;

    return this.assegnazioni.filter((a) => {
      if (this.filtroStato && a.stato !== this.filtroStato) {
        return false;
      }
      if (this.filtroCategoria && a.corso?.categoria !== this.filtroCategoria) {
        return false;
      }
      if (this.filtroScadenza) {
        const scadenza = new Date(a.dataScadenza).getTime();
        const nonCompletato = a.stato !== Stato.Completato && a.stato !== Stato.Annullato;
        if (this.filtroScadenza === 'scadute' && !(scadenza < now && nonCompletato)) {
          return false;
        }
        if (
          this.filtroScadenza === 'prossime30' &&
          !(scadenza >= now && scadenza <= in30 && nonCompletato)
        ) {
          return false;
        }
      }
      return true;
    });
  }

  toggleDettaglio(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  completabile(a: Assegnazione): boolean {
    return a.stato !== Stato.Completato && a.stato !== Stato.Annullato;
  }

  completa(a: Assegnazione): void {
    this.error = '';
    this.message = '';
    this.assegnazioniSrv.completa(a.id).subscribe({
      next: (aggiornata) => {
        // Sostituisce l'elemento aggiornato nella lista.
        this.assegnazioni = this.assegnazioni.map((x) => (x.id === aggiornata.id ? aggiornata : x));
        this.message = `Corso "${aggiornata.corso?.titolo ?? ''}" segnato come completato.`;
      },
      error: (err) => {
        this.error = this.extractError(err);
      },
    });
  }

  resetFiltri(): void {
    this.filtroStato = '';
    this.filtroCategoria = '';
    this.filtroScadenza = '';
  }

  private extractError(err: any): string {
    return err?.error?.message || err?.error?.error || 'Si è verificato un errore';
  }
}
