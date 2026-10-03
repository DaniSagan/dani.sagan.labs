import { Injectable, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NavigationStatusService {
  readonly loading = signal(false);
  readonly destination = signal('la página');
  readonly error = signal('');
  private navigationId = 0;

  constructor(router: Router) {
    router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigationId = event.id;
        this.error.set('');
        const section = event.url.split(/[/?#]/)[1];
        this.destination.set(
          (
            {
              home: 'Inicio',
              articles: 'Artículos',
              tools: 'Herramientas',
              games: 'Juegos',
              problems: 'Problemas',
            } as Record<string, string>
          )[section] || 'la página',
        );
        this.loading.set(true);
      } else if (event instanceof NavigationEnd) {
        // Keep feedback until the new view has had an opportunity to paint.
        const id = event.id;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (this.navigationId === id) this.loading.set(false);
          }),
        );
      } else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof NavigationSkipped
      ) {
        if (event.id === this.navigationId) this.loading.set(false);
        if (event instanceof NavigationError && event.id === this.navigationId)
          this.error.set(
            'No se pudo abrir la página. Comprueba tu conexión e inténtalo de nuevo.',
          );
      }
    });
  }
}
