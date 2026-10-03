import { Component, inject } from '@angular/core';
import { NavigationStatusService } from './navigation-status.service';

@Component({
  selector: 'app-navigation-feedback',
  standalone: true,
  template: `
    @if (status.loading()) {
      <div class="loading-track" aria-hidden="true"><span></span></div>
      <div class="loading-card" role="status" aria-live="polite">
        <span class="orbit" aria-hidden="true"><i></i><i></i><i></i></span>
        <span
          >Abriendo {{ status.destination()
          }}<span class="loading-caption">Un momento…</span></span
        >
      </div>
    }
    @if (status.error()) {
      <div class="error-card" role="alert">
        <span>{{ status.error() }}</span
        ><button
          type="button"
          (click)="status.error.set('')"
          aria-label="Cerrar aviso"
        >
          ×
        </button>
      </div>
    }
  `,
  styleUrl: './navigation-feedback.component.css',
})
export class NavigationFeedbackComponent {
  readonly status = inject(NavigationStatusService);
}
