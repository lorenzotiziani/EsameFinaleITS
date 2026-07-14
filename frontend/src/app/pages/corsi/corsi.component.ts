import { Component, inject, OnInit } from '@angular/core';
import { CorsiService } from '../../services/corsi.service';
import { ToastService } from '../../services/toast.service';
import { Corso, CorsoInput } from '../../entities/Corso';

@Component({
  selector: 'app-corsi',
  standalone: false,
  templateUrl: './corsi.component.html',
})
export class CorsiComponent implements OnInit {
  private corsiSrv = inject(CorsiService);
  private toast = inject(ToastService);

  corsi: Corso[] = [];
  categorie: string[] = [];
  loading = false;
  loadError = '';

  // Filtri (server-side).
  filtroCategoria = '';
  filtroAttivo: '' | 'true' | 'false' = '';

  // Form crea/modifica (modal).
  showForm = false;
  editingId: number | null = null;
  formError = '';
  formModel: CorsoInput = this.emptyForm();

  ngOnInit(): void {
    this.loadCategorie();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    const filters = {
      categoria: this.filtroCategoria || undefined,
      attivo: this.filtroAttivo === '' ? undefined : this.filtroAttivo === 'true',
    };
    this.corsiSrv.list(filters).subscribe({
      next: (data) => {
        this.corsi = data;
        this.loading = false;
      },
      error: (err) => {
        this.loadError = this.extractError(err);
        this.loading = false;
      },
    });
  }

  // Categorie per il filtro: caricate dall'elenco completo una volta sola.
  private loadCategorie(): void {
    this.corsiSrv.list().subscribe({
      next: (data) => {
        this.categorie = Array.from(new Set(data.map((c) => c.categoria))).sort();
      },
    });
  }

  resetFiltri(): void {
    this.filtroCategoria = '';
    this.filtroAttivo = '';
    this.load();
  }

  openCreate(): void {
    this.editingId = null;
    this.formModel = this.emptyForm();
    this.formError = '';
    this.showForm = true;
  }

  openEdit(c: Corso): void {
    this.editingId = c.id;
    this.formModel = {
      titolo: c.titolo,
      descrizione: c.descrizione ?? '',
      categoria: c.categoria,
      durataOre: c.durataOre,
      obbligatorio: c.obbligatorio,
      attivo: c.attivo,
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

    // Validazione minima lato client (il backend valida comunque).
    if (!this.formModel.titolo?.trim()) {
      this.formError = 'Il titolo è obbligatorio.';
      return;
    }
    if (!this.formModel.categoria?.trim()) {
      this.formError = 'La categoria è obbligatoria.';
      return;
    }
    if (!this.formModel.durataOre || this.formModel.durataOre <= 0) {
      this.formError = 'La durata deve essere maggiore di zero.';
      return;
    }

    const payload: CorsoInput = {
      ...this.formModel,
      titolo: this.formModel.titolo.trim(),
      categoria: this.formModel.categoria.trim(),
      descrizione: this.formModel.descrizione?.trim() || null,
    };

    const creating = this.editingId === null;
    const request$ = creating
      ? this.corsiSrv.create(payload)
      : this.corsiSrv.update(this.editingId!, payload);

    request$.subscribe({
      next: () => {
        this.toast.success(creating ? 'Corso creato.' : 'Corso aggiornato.');
        this.showForm = false;
        this.loadCategorie();
        this.load();
      },
      error: (err) => {
        this.formError = this.extractError(err);
      },
    });
  }

  toggleAttivo(c: Corso): void {
    this.corsiSrv.changeStatus(c.id, !c.attivo).subscribe({
      next: (aggiornato) => {
        this.corsi = this.corsi.map((x) => (x.id === aggiornato.id ? aggiornato : x));
        this.toast.success(
          `Corso "${aggiornato.titolo}" ${aggiornato.attivo ? 'attivato' : 'disattivato'}.`
        );
      },
      error: (err) => this.toast.error(this.extractError(err)),
    });
  }

  remove(c: Corso): void {
    if (!confirm(`Eliminare il corso "${c.titolo}"? L'operazione non è reversibile.`)) {
      return;
    }
    this.corsiSrv.remove(c.id).subscribe({
      next: () => {
        this.corsi = this.corsi.filter((x) => x.id !== c.id);
        this.toast.success('Corso eliminato.');
      },
      // Tipicamente 409: il corso ha assegnazioni collegate.
      error: (err) => this.toast.error(this.extractError(err)),
    });
  }

  private emptyForm(): CorsoInput {
    return {
      titolo: '',
      descrizione: '',
      categoria: '',
      durataOre: 1,
      obbligatorio: false,
      attivo: true,
    };
  }

  private extractError(err: any): string {
    return err?.error?.message || err?.error?.error || 'Si è verificato un errore';
  }
}
