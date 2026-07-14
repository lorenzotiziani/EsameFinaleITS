import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MieiCorsiComponent } from './pages/miei-corsi/miei-corsi.component';
import { CorsiComponent } from './pages/corsi/corsi.component';
import { AssegnazioniComponent } from './pages/assegnazioni/assegnazioni.component';
import { StatisticheComponent } from './pages/statistiche/statistiche.component';
import { DipendentiComponent } from './pages/dipendenti/dipendenti.component';
import { authGuard } from './utils/auth.guard';
import { roleGuard } from './utils/role.guard';
import { Ruolo } from './entities/Ruolo';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  // Area dipendente
  {
    path: 'miei-corsi',
    component: MieiCorsiComponent,
    canActivate: [roleGuard(Ruolo.DIPENDENTE)],
  },
  // Area referente Academy
  {
    path: 'corsi',
    component: CorsiComponent,
    canActivate: [roleGuard(Ruolo.REFERENTE_ACADEMY)],
  },
  {
    path: 'assegnazioni-corsi',
    component: AssegnazioniComponent,
    canActivate: [roleGuard(Ruolo.REFERENTE_ACADEMY)],
  },
  {
    path: 'dipendenti',
    component: DipendentiComponent,
    canActivate: [roleGuard(Ruolo.REFERENTE_ACADEMY)],
  },
  {
    path: 'statistiche',
    component: StatisticheComponent,
    canActivate: [roleGuard(Ruolo.REFERENTE_ACADEMY)],
  },
  // Accesso negato (ruolo non abilitato): l'utente è autenticato, torna alla dashboard
  {
    path: 'unauthorized',
    redirectTo: '',
  },
  // Wildcard: qualsiasi path sconosciuto torna alla dashboard
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
