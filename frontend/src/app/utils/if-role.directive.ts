import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Mostra il contenuto solo se il ruolo dell'utente corrente è tra quelli indicati.
// Uso: <button *ifRole="'REFERENTE_ACADEMY'">...</button>
//      <div *ifRole="['DIPENDENTE', 'REFERENTE_ACADEMY']">...</div>
@Directive({
  selector: '[ifRole]',
  standalone: false,
})
export class IfRoleDirective implements OnInit, OnDestroy {
  private authSrv = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);

  private destroyed$ = new Subject<void>();
  private allowed: string[] = [];
  private ruoloCorrente: string | null = null;
  private hasView = false;

  @Input() set ifRole(roles: string | string[]) {
    this.allowed = Array.isArray(roles) ? roles : [roles];
    this.render();
  }

  ngOnInit(): void {
    this.authSrv.currentUser$.pipe(takeUntil(this.destroyed$)).subscribe((user) => {
      this.ruoloCorrente = user?.ruolo ?? null;
      this.render();
    });
  }

  private render(): void {
    const consentito = !!this.ruoloCorrente && this.allowed.includes(this.ruoloCorrente);

    if (consentito && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!consentito && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
