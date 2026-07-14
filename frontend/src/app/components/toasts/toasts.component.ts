import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: false,
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css',
})
export class ToastsComponent {
  protected toastSrv = inject(ToastService);
}
