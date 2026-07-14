import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Assegnazione,
  AssegnazioneCreateInput,
  AssegnazioneUpdateInput,
} from '../entities/Assegnazione';
import { Stato } from '../entities/Stato';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AssegnazioniFilters {
  stato?: Stato;
  categoria?: string;
  corsoId?: number;
  dipendenteId?: number;
}

@Injectable({ providedIn: 'root' })
export class AssegnazioniService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/assegnazioni-corsi`;

  list(filters?: AssegnazioniFilters): Observable<Assegnazione[]> {
    let params = new HttpParams();
    if (filters?.stato) {
      params = params.set('stato', filters.stato);
    }
    if (filters?.categoria) {
      params = params.set('categoria', filters.categoria);
    }
    if (filters?.corsoId !== undefined) {
      params = params.set('corsoId', String(filters.corsoId));
    }
    if (filters?.dipendenteId !== undefined) {
      params = params.set('dipendenteId', String(filters.dipendenteId));
    }
    return this.http
      .get<ApiResponse<Assegnazione[]>>(this.API, { params })
      .pipe(map((r) => r.data));
  }

  getById(id: number): Observable<Assegnazione> {
    return this.http.get<ApiResponse<Assegnazione>>(`${this.API}/${id}`).pipe(map((r) => r.data));
  }

  create(input: AssegnazioneCreateInput): Observable<Assegnazione> {
    return this.http.post<ApiResponse<Assegnazione>>(this.API, input).pipe(map((r) => r.data));
  }

  update(id: number, input: AssegnazioneUpdateInput): Observable<Assegnazione> {
    return this.http
      .put<ApiResponse<Assegnazione>>(`${this.API}/${id}`, input)
      .pipe(map((r) => r.data));
  }

  completa(id: number): Observable<Assegnazione> {
    return this.http
      .put<ApiResponse<Assegnazione>>(`${this.API}/${id}/completa`, {})
      .pipe(map((r) => r.data));
  }

  annulla(id: number): Observable<Assegnazione> {
    return this.http
      .put<ApiResponse<Assegnazione>>(`${this.API}/${id}/annulla`, {})
      .pipe(map((r) => r.data));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`).pipe(map(() => void 0));
  }
}
