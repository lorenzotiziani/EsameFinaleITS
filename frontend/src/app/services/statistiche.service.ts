import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StatisticaRow, StatisticheFilters } from '../entities/Statistica';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class StatisticheService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/statistiche`;

  getAcademy(filters?: StatisticheFilters): Observable<StatisticaRow[]> {
    let params = new HttpParams();
    if (filters?.mese) {
      params = params.set('mese', filters.mese);
    }
    if (filters?.categoria) {
      params = params.set('categoria', filters.categoria);
    }
    if (filters?.dipendenteId !== undefined) {
      params = params.set('dipendenteId', String(filters.dipendenteId));
    }
    return this.http
      .get<ApiResponse<StatisticaRow[]>>(`${this.API}/academy`, { params })
      .pipe(map((r) => r.data));
  }
}
