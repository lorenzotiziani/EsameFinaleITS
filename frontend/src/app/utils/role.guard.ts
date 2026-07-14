import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { Ruolo } from '../entities/Ruolo';

// Factory di guardia per rotta: consente l'accesso solo ai ruoli indicati.
// Uso: canActivate: [roleGuard(Ruolo.REFERENTE_ACADEMY)]
export function roleGuard(...allowed: Ruolo[]): CanActivateFn {
  return (route, state) => {
    const jwt = inject(JwtService);
    const router = inject(Router);

    // Prima l'autenticazione: senza token valido si torna al login.
    if (!jwt.isAuthenticated()) {
      jwt.removeToken();
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url, reason: 'unauthorized' },
      });
      return false;
    }

    const ruolo = jwt.getRuolo();
    if (ruolo && allowed.includes(ruolo as Ruolo)) {
      return true;
    }

    // Autenticato ma ruolo non abilitato: accesso negato.
    router.navigate(['/unauthorized']);
    return false;
  };
}
