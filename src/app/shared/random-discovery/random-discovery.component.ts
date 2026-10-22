import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RANDOM_PAGE_ROUTES } from '../../home/home-article/random-pages';

type DiscoverySection = 'articles' | 'tools' | 'games';

@Component({
  selector: 'app-random-discovery',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="random-links">
      @for (link of links; track link.section) {
        @if (!section || section === link.section) {
          <a [routerLink]="link.route"><span aria-hidden="true">&#x2684;</span> {{ link.label }} <span aria-hidden="true">&#x2197;</span></a>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; margin: 1.25rem 0 1.75rem; }
    .random-links { display: flex; flex-wrap: wrap; gap: .75rem; }
    a { display: inline-flex; align-items: center; gap: .7rem; min-height: 44px; padding: 8px 16px; box-sizing: border-box; border: 1px solid var(--gold); border-radius: 8px; color: var(--gold); text-decoration: none; font-weight: 600; }
    a:hover { background: #e8b76815; }
    a:focus-visible { outline: 3px solid var(--gold); outline-offset: 4px; }
  `],
})
export class RandomDiscoveryComponent {
  @Input() section?: DiscoverySection;

  readonly links = ([
    { section: 'articles', label: 'Artículo al azar' },
    { section: 'tools', label: 'Herramienta al azar' },
    { section: 'games', label: 'Juego al azar' },
  ] as const).map(link => {
    const routes = RANDOM_PAGE_ROUTES.filter(route => route.startsWith('/' + link.section + '/'));
    return { ...link, route: routes[Math.floor(Math.random() * routes.length)] };
  });
}
