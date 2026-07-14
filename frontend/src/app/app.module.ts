import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MieiCorsiComponent } from './pages/miei-corsi/miei-corsi.component';
import { CorsiComponent } from './pages/corsi/corsi.component';
import { AssegnazioniComponent } from './pages/assegnazioni/assegnazioni.component';
import { StatisticheComponent } from './pages/statistiche/statistiche.component';
import { DipendentiComponent } from './pages/dipendenti/dipendenti.component';
import {IfAuthenticatedDirective} from './utils/if-authenticated.directive'
import {IfRoleDirective} from './utils/if-role.directive'
import {BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MieiCorsiComponent,
    CorsiComponent,
    AssegnazioniComponent,
    StatisticheComponent,
    DipendentiComponent,
    IfAuthenticatedDirective,
    IfRoleDirective,
    NavbarComponent,
    ToastsComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
