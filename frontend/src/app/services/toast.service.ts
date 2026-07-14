import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'danger' | 'info';

export interface Toast {
  id: number;
  text: string;
  type: ToastType;
}

// Notifiche transitorie: si rimuovono da sole dopo un timeout.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts$ = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this._toasts$.asObservable();
  private counter = 0;

  private push(text: string, type: ToastType, timeout: number): void {
    const id = ++this.counter;
    this._toasts$.next([...this._toasts$.value, { id, text, type }]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(id), timeout);
    }
  }

  success(text: string): void {
    this.push(text, 'success', 4000);
  }

  error(text: string): void {
    this.push(text, 'danger', 6000);
  }

  info(text: string): void {
    this.push(text, 'info', 4000);
  }

  dismiss(id: number): void {
    this._toasts$.next(this._toasts$.value.filter((t) => t.id !== id));
  }
}
