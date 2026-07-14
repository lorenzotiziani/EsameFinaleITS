import { Component, inject, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatisticheService } from '../../services/statistiche.service';
import { CorsiService } from '../../services/corsi.service';
import { UserService } from '../../services/user.service';
import { StatisticaRow } from '../../entities/Statistica';
import { DipendenteRef } from '../../entities/Assegnazione';

@Component({
  selector: 'app-statistiche',
  standalone: false,
  templateUrl: './statistiche.component.html',
})
export class StatisticheComponent implements OnInit {
  private statsSrv = inject(StatisticheService);
  private corsiSrv = inject(CorsiService);
  private userSrv = inject(UserService);

  rows: StatisticaRow[] = [];
  categorie: string[] = [];
  dipendenti: DipendenteRef[] = [];

  loading = false;
  error = '';
  vista: 'tabella' | 'grafico' = 'tabella';

  // Filtri.
  filtroMese = '';
  filtroCategoria = '';
  filtroDipendenteId: number | '' = '';

  // Grafico.
  readonly barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  readonly barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  ngOnInit(): void {
    this.corsiSrv.list().subscribe({
      next: (corsi) => (this.categorie = Array.from(new Set(corsi.map((c) => c.categoria))).sort()),
    });
    this.userSrv.getDipendenti().subscribe({
      next: (d) => (this.dipendenti = d),
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.statsSrv
      .getAcademy({
        mese: this.filtroMese || undefined,
        categoria: this.filtroCategoria || undefined,
        dipendenteId: this.filtroDipendenteId === '' ? undefined : Number(this.filtroDipendenteId),
      })
      .subscribe({
        next: (data) => {
          this.rows = data;
          this.buildChart(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = this.extractError(err);
          this.loading = false;
        },
      });
  }

  resetFiltri(): void {
    this.filtroMese = '';
    this.filtroCategoria = '';
    this.filtroDipendenteId = '';
    this.load();
  }

  private buildChart(rows: StatisticaRow[]): void {
    this.barChartData = {
      labels: rows.map((r) => `${r.mese} · ${r.categoria}`),
      datasets: [
        {
          label: 'Assegnati',
          data: rows.map((r) => r.numeroAssegnazioni),
          backgroundColor: 'rgba(124, 58, 237, 0.75)',
        },
        {
          label: 'Completati',
          data: rows.map((r) => r.numeroCompletamenti),
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
        },
      ],
    };
  }

  private extractError(err: any): string {
    return err?.error?.message || err?.error?.error || 'Si è verificato un errore';
  }
}
