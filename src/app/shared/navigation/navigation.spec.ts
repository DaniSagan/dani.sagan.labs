import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Route,
  Router,
} from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { IdlePreloadingStrategy } from './idle-preloading.strategy';
import { NavigationStatusService } from './navigation-status.service';

describe('Navigation feedback lifecycle', () => {
  let events: Subject<unknown>, status: NavigationStatusService;
  beforeEach(() => {
    events = new Subject();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events } }],
    });
    status = TestBed.inject(NavigationStatusService);
  });
  it('reacts immediately and waits for the new view to paint', fakeAsync(() => {
    events.next(new NavigationStart(1, '/articles'));
    expect(status.loading()).toBe(true);
    expect(status.destination()).toBe('Artículos');
    events.next(new NavigationEnd(1, '/articles', '/articles'));
    expect(status.loading()).toBe(true);
    tick(40);
    expect(status.loading()).toBe(false);
  }));
  it('does not let an older completion hide a newer navigation', fakeAsync(() => {
    events.next(new NavigationStart(1, '/articles'));
    events.next(new NavigationEnd(1, '/articles', '/articles'));
    events.next(new NavigationStart(2, '/tools/prime-decomposition'));
    tick(40);
    expect(status.loading()).toBe(true);
    expect(status.destination()).toBe('Herramientas');
    events.next(
      new NavigationCancel(2, '/tools/prime-decomposition', 'Cancelled'),
    );
    expect(status.loading()).toBe(false);
  }));
  it('clears feedback on errors, skips and the next attempt', () => {
    events.next(new NavigationStart(1, '/games'));
    events.next(new NavigationError(1, '/games', new Error('Offline')));
    expect(status.loading()).toBe(false);
    expect(status.error()).toContain('conexión');
    events.next(new NavigationStart(2, '/games'));
    expect(status.error()).toBe('');
    events.next(new NavigationSkipped(2, '/games', 'Same URL'));
    expect(status.loading()).toBe(false);
  });
});

describe('Idle and intent preloading', () => {
  let strategy: IdlePreloadingStrategy;
  beforeEach(() => {
    strategy = new IdlePreloadingStrategy();
  });
  it('keeps imports out of initial rendering and accelerates on intent only once', fakeAsync(() => {
    const route: Route = { path: 'articles' },
      load = jasmine.createSpy('load').and.returnValue(of('loaded'));
    strategy.preload(route, load).subscribe();
    tick(500);
    expect(load).not.toHaveBeenCalled();
    strategy.warm('articles');
    expect(load).toHaveBeenCalledTimes(1);
    strategy.preload(route, load).subscribe();
    strategy.warm('articles');
    tick(1500);
    expect(load).toHaveBeenCalledTimes(1);
  }));
  it('remembers intent before the router registers a route', () => {
    strategy.warm('games');
    const load = jasmine.createSpy('load').and.returnValue(of('loaded'));
    strategy.preload({ path: 'games' }, load).subscribe();
    expect(load).toHaveBeenCalledTimes(1);
  });
  it('uses an idle callback after the initial delay', fakeAsync(() => {
    let callback: IdleRequestCallback | undefined;
    spyOn(window, 'requestIdleCallback').and.callFake((cb) => {
      callback = cb;
      return 7;
    });
    spyOn(window, 'cancelIdleCallback');
    const load = jasmine.createSpy('load').and.returnValue(of('loaded'));
    strategy.preload({ path: 'tools' }, load).subscribe();
    tick(1200);
    expect(load).not.toHaveBeenCalled();
    callback!({ didTimeout: false, timeRemaining: () => 40 });
    expect(load).toHaveBeenCalledTimes(1);
  }));
  it('isolates speculative download failures', () => {
    strategy.warm('articles');
    let failed = false;
    strategy
      .preload({ path: 'articles' }, () => throwError(new Error('Offline')))
      .subscribe({ error: () => (failed = true) });
    expect(failed).toBe(false);
  });
});
