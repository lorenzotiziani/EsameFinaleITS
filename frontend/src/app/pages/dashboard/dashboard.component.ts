import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Ruolo } from '../../entities/Ruolo';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected authSrv = inject(AuthService);
  protected readonly Ruolo = Ruolo;
}
