import { Component, inject, OnInit } from '@angular/core';
import { AssegnazioniService } from '../../services/assegnazioni.service';
import { ToastService } from '../../services/toast.service';
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
  private toast = inject(ToastService);

  assegnazioni: Assegnazione[] = [];
  loading = false;
  loadError = '';

  // Filtri (applicati lato client sul dataset del dipendente).
  filtroStato: Stato | '' = '';
  filtroCategoria = '';
  filtroScadenza: FiltroScadenza = '';

  // Dettaglio (modal).
  dettaglio: Assegnazione | null = null;

  readonly Stato = Stato;
  readonly STATO_BADGE = STATO_BADGE;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    this.assegnazioniSrv.list().subscribe({
      next: (data) => {
        this.assegnazioni = data;
        this.loading = false;
      },
      error: (err) => {
        this.loadError = this.extractError(err);
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

  openDettaglio(a: Assegnazione): void {
    this.dettaglio = a;
  }

  closeDettaglio(): void {
    this.dettaglio = null;
  }

  completabile(a: Assegnazione): boolean {
    return a.stato !== Stato.Completato && a.stato !== Stato.Annullato;
  }

  completa(a: Assegnazione): void {
    this.assegnazioniSrv.completa(a.id).subscribe({
      next: (aggiornata) => {
        this.assegnazioni = this.assegnazioni.map((x) => (x.id === aggiornata.id ? aggiornata : x));
        if (this.dettaglio?.id === aggiornata.id) {
          this.dettaglio = aggiornata;
        }
        this.toast.success(`Corso "${aggiornata.corso?.titolo ?? ''}" segnato come completato.`);
      },
      error: (err) => this.toast.error(this.extractError(err)),
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
