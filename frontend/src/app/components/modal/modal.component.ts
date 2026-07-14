import { Component, EventEmitter, Input, Output } from '@angular/core';

// Modal generico basato sugli stili Bootstrap ma controllato da Angular
// (Bootstrap JS non è incluso nel progetto).
@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();

  onBackdrop(): void {
    this.close.emit();
  }
}
