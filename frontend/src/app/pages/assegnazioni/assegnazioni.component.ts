import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AssegnazioniService } from '../../services/assegnazioni.service';
import { CorsiService } from '../../services/corsi.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Assegnazione, DipendenteRef } from '../../entities/Assegnazione';
import { Corso } from '../../entities/Corso';
import { Stato, STATO_BADGE } from '../../entities/Stato';

@Component({
  selector: 'app-assegnazioni',
  standalone: false,
  templateUrl: './assegnazioni.component.html',
})
export class AssegnazioniComponent implements OnInit {
  private assegnazioniSrv = inject(AssegnazioniService);
  private corsiSrv = inject(CorsiService);
  private userSrv = inject(UserService);
  private toast = inject(ToastService);

  assegnazioni: Assegnazione[] = [];
  corsi: Corso[] = [];
  dipendenti: DipendenteRef[] = [];
  categorie: string[] = [];

  loading = false;
  loadError = '';

  // Filtri (server-side).
  filtroStato: Stato | '' = '';
  filtroCategoria = '';
  filtroCorsoId: number | '' = '';
  filtroDipendenteId: number | '' = '';

  // Form (modal).
  showForm = false;
  editing: Assegnazione | null = null;
  formError = '';
  formModel = this.emptyForm();

  readonly Stato = Stato;
  readonly STATO_BADGE = STATO_BADGE;

  ngOnInit(): void {
    // Carica in parallelo corsi e dipendenti (per i select e i filtri), poi le assegnazioni.
    forkJoin({
      corsi: this.corsiSrv.list(),
      dipendenti: this.userSrv.getDipendenti(),
    }).subscribe({
      next: ({ corsi, dipendenti }) => {
        this.corsi = corsi;
        this.dipendenti = dipendenti;
        this.categorie = Array.from(new Set(corsi.map((c) => c.categoria))).sort();
      },
      error: (err) => this.toast.error(this.extractError(err)),
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    this.assegnazioniSrv
      .list({
        stato: this.filtroStato || undefined,
        categoria: this.filtroCategoria || undefined,
        corsoId: this.filtroCorsoId === '' ? undefined : Number(this.filtroCorsoId),
        dipendenteId: this.filtroDipendenteId === '' ? undefined : Number(this.filtroDipendenteId),
      })
      .subscribe({
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

  resetFiltri(): void {
    this.filtroStato = '';
    this.filtroCategoria = '';
    this.filtroCorsoId = '';
    this.filtroDipendenteId = '';
    this.load();
  }

  get corsiAttivi(): Corso[] {
    return this.corsi.filter((c) => c.attivo);
  }

  openCreate(): void {
    this.editing = null;
    this.formModel = this.emptyForm();
    this.formError = '';
    this.showForm = true;
  }

  openEdit(a: Assegnazione): void {
    this.editing = a;
    this.formModel = {
      corsoId: a.corsoId,
      dipendenteId: a.dipendenteId,
      dataScadenza: a.dataScadenza?.slice(0, 10) ?? '',
      dataAssegnazione: a.dataAssegnazione?.slice(0, 10) ?? '',
      stato: a.stato,
    };
    this.formError = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.formError = '';
  }

  save(): void {
    this.formError = '';

    if (this.editing === null) {
      // Creazione.
      if (!this.formModel.corsoId) {
        this.formError = 'Seleziona un corso.';
        return;
      }
      if (!this.formModel.dipendenteId) {
        this.formError = 'Seleziona un dipendente.';
        return;
      }
      if (!this.formModel.dataScadenza) {
        this.formError = 'Indica la data di scadenza.';
        return;
      }
      this.assegnazioniSrv
        .create({
          corsoId: Number(this.formModel.corsoId),
          dipendenteId: Number(this.formModel.dipendenteId),
          dataScadenza: this.formModel.dataScadenza,
          dataAssegnazione: this.formModel.dataAssegnazione || undefined,
        })
        .subscribe({
          next: () => {
            this.toast.success('Assegnazione creata.');
            this.showForm = false;
            this.load();
          },
          error: (err) => (this.formError = this.extractError(err)),
        });
    } else {
      // Modifica: aggiorno scadenza e stato.
      if (!this.formModel.dataScadenza) {
        this.formError = 'Indica la data di scadenza.';
        return;
      }
      this.assegnazioniSrv
        .update(this.editing.id, {
          dataScadenza: this.formModel.dataScadenza,
          stato: this.formModel.stato,
        })
        .subscribe({
          next: (aggiornata) => {
            this.toast.success('Assegnazione aggiornata.');
            this.showForm = false;
            this.assegnazioni = this.assegnazioni.map((x) =>
              x.id === aggiornata.id ? aggiornata : x
            );
          },
          error: (err) => (this.formError = this.extractError(err)),
        });
    }
  }

  annulla(a: Assegnazione): void {
    if (!confirm('Annullare questa assegnazione?')) {
      return;
    }
    this.assegnazioniSrv.annulla(a.id).subscribe({
      next: (aggiornata) => {
        this.assegnazioni = this.assegnazioni.map((x) => (x.id === aggiornata.id ? aggiornata : x));
        this.toast.success('Assegnazione annullata.');
      },
      error: (err) => this.toast.error(this.extractError(err)),
    });
  }

  remove(a: Assegnazione): void {
    if (!confirm('Eliminare definitivamente questa assegnazione?')) {
      return;
    }
    this.assegnazioniSrv.remove(a.id).subscribe({
      next: () => {
        this.assegnazioni = this.assegnazioni.filter((x) => x.id !== a.id);
        this.toast.success('Assegnazione eliminata.');
      },
      error: (err) => this.toast.error(this.extractError(err)),
    });
  }

  annullabile(a: Assegnazione): boolean {
    return a.stato !== Stato.Annullato;
  }

  private emptyForm() {
    return {
      corsoId: '' as number | '',
      dipendenteId: '' as number | '',
      dataScadenza: '',
      dataAssegnazione: '',
      stato: Stato.Assegnato as Stato,
    };
  }

  private extractError(err: any): string {
    return err?.error?.message || err?.error?.error || 'Si è verificato un errore';
  }
}
