import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable, Subject, race, of } from 'rxjs';
import { catchError, shareReplay, switchMap, take } from 'rxjs/operators';

/** Keep the initial render light, then fetch lazy sections during idle time. */
@Injectable({ providedIn: 'root' })
export class IdlePreloadingStrategy implements PreloadingStrategy {
  private readonly intentions = new Map<string, Subject<void>>();
  private readonly requested = new Set<string>();
  private readonly jobs = new WeakMap<Route, Observable<unknown>>();

  warm(path: string): void {
    this.requested.add(path);
    this.intentions.get(path)?.next();
  }

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const existing = this.jobs.get(route);
    if (existing) return existing;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    // Navigation itself still loads normally on constrained connections.
    if (
      connection?.saveData ||
      ['slow-2g', '2g'].includes(connection?.effectiveType || '')
    )
      return EMPTY;
    const path = route.path || '';
    const intention = new Subject<void>();
    this.intentions.set(path, intention);
    const idle = new Observable<void>((subscriber) => {
      let idleId: number | undefined;
      const timer = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(
            () => {
              subscriber.next();
              subscriber.complete();
            },
            { timeout: 3000 },
          );
        } else {
          subscriber.next();
          subscriber.complete();
        }
      }, 1200);
      return () => {
        clearTimeout(timer);
        if (idleId !== undefined) window.cancelIdleCallback(idleId);
      };
    });
    const job = (
      this.requested.has(path) ? of(undefined) : race(idle, intention)
    ).pipe(
      take(1),
      switchMap(() => load()),
      // A failed speculative download must not affect navigation or other sections.
      catchError(() => EMPTY),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.jobs.set(route, job);
    return job;
  }
}
