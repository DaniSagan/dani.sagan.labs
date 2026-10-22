import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, Scroll } from '@angular/router';

/** Keep the navbar visible on fresh pages; let Angular restore history and resolve fragments. */
@Injectable({ providedIn: 'root' })
export class ContentScrollService {
  constructor(router: Router, viewport: ViewportScroller, @Inject(DOCUMENT) document: Document) {
    let latestScroll: Scroll | undefined;
    router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (!(event instanceof Scroll)) return;
      latestScroll = event;
      if (event.position || event.anchor) return;
      // Run after the router's own scroll subscriber, regardless of bootstrap order.
      queueMicrotask(() => {
        if (latestScroll !== event) return;
        const content = document.getElementById('main-content');
        if (!content) return;
        const start = document.querySelector('app-navbar') ?? content;
        const top = start.getBoundingClientRect().top + viewport.getScrollPosition()[1];
        viewport.scrollToPosition([0, top]);
      });
    });
  }
}
