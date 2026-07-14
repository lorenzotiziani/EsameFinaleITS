import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DipendenteRef } from '../../entities/Assegnazione';

@Component({
  selector: 'app-dipendenti',
  standalone: false,
  templateUrl: './dipendenti.component.html',
})
export class DipendentiComponent implements OnInit {
  private userSrv = inject(UserService);

  dipendenti: DipendenteRef[] = [];
  loading = false;
  loadError = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    this.userSrv.getDipendenti().subscribe({
      next: (data) => {
        this.dipendenti = data;
        this.loading = false;
      },
      error: (err) => {
        this.loadError = err?.error?.message || err?.error?.error || 'Si è verificato un errore';
        this.loading = false;
      },
    });
  }
}
