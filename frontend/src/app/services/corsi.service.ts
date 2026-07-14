import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Corso, CorsoInput } from '../entities/Corso';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CorsiFilters {
  categoria?: string;
  attivo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CorsiService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/corsi`;

  list(filters?: CorsiFilters): Observable<Corso[]> {
    let params = new HttpParams();
    if (filters?.categoria) {
      params = params.set('categoria', filters.categoria);
    }
    if (filters?.attivo !== undefined) {
      params = params.set('attivo', String(filters.attivo));
    }
    return this.http.get<ApiResponse<Corso[]>>(this.API, { params }).pipe(map((r) => r.data));
  }

  getById(id: number): Observable<Corso> {
    return this.http.get<ApiResponse<Corso>>(`${this.API}/${id}`).pipe(map((r) => r.data));
  }

  create(input: CorsoInput): Observable<Corso> {
    return this.http.post<ApiResponse<Corso>>(this.API, input).pipe(map((r) => r.data));
  }

  update(id: number, input: Partial<CorsoInput>): Observable<Corso> {
    return this.http.put<ApiResponse<Corso>>(`${this.API}/${id}`, input).pipe(map((r) => r.data));
  }

  changeStatus(id: number, attivo: boolean): Observable<Corso> {
    return this.http
      .put<ApiResponse<Corso>>(`${this.API}/${id}/changeStatus`, { attivo })
      .pipe(map((r) => r.data));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`).pipe(map(() => void 0));
  }
}
