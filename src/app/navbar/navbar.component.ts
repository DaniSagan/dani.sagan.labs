import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  inject,
} from '@angular/core';
import { IdlePreloadingStrategy } from '../shared/navigation/idle-preloading.strategy';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  @ViewChild('navSurface', { static: true })
  private navSurface!: ElementRef<HTMLElement>;
  readonly preloading = inject(IdlePreloadingStrategy);

  sectionActive(section: string): boolean {
    return this.router.isActive('/' + section, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  get articlesActive(): boolean {
    return (
      this.sectionActive('articles') && !this.sectionActive('articles/contact')
    );
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const nav = this.navSurface.nativeElement;
      const indicator = nav.querySelector<HTMLElement>('.selection-indicator')!;
      const links = nav.querySelector<HTMLElement>('.nav-links')!;
      let frame = 0;
      const update = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const active = links.querySelector<HTMLElement>('a.active');
          indicator.style.opacity = active ? '1' : '0';
          if (!active) return;
          const bounds = nav.getBoundingClientRect();
          const target = active.getBoundingClientRect();
          indicator.style.width = `${target.width}px`;
          indicator.style.height = `${target.height}px`;
          indicator.style.transform = `translate3d(${target.left - bounds.left - nav.clientLeft}px, ${target.top - bounds.top - nav.clientTop}px, 0)`;
        });
      };
      const selection = new MutationObserver(update);
      selection.observe(links, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
      const resize = new ResizeObserver(update);
      resize.observe(links);
      update();
      this.destroyRef.onDestroy(() => {
        selection.disconnect();
        resize.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }
}
