import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DipendenteRef } from '../entities/Assegnazione';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/users`;

  // Elenco dei dipendenti (il backend filtra per ruolo DIPENDENTE). Solo referente.
  getDipendenti(): Observable<DipendenteRef[]> {
    return this.http.get<ApiResponse<DipendenteRef[]>>(this.API).pipe(map((r) => r.data));
  }
}
