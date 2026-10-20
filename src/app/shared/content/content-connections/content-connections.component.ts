import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ContentConnection { route: string; label: string; reason: string; }

@Component({
  selector: 'app-content-connections', standalone: true, imports: [RouterLink],
  template: `<section aria-label="Conexiones para seguir aprendiendo"><details><summary>La matemática detrás del juego</summary><ul>@for (link of links; track link.route) {<li><a [routerLink]="link.route">{{ link.label }}</a><p>{{ link.reason }}</p></li>}</ul></details></section>`,
  styles: [':host{display:block;max-width:1000px;margin:2rem auto;padding:0 16px;box-sizing:border-box;color:var(--ink)}section{border:1px solid var(--rule);border-radius:12px;padding:16px;background:var(--paper)}summary{cursor:pointer;font-weight:600;line-height:1.6}ul{padding-left:22px}li{margin:16px 0;line-height:1.6;overflow-wrap:anywhere}p{margin:4px 0;color:var(--ink-dim);font-size:.95rem}a{color:var(--accent)}a:focus-visible,summary:focus-visible{outline:3px solid var(--gold);outline-offset:4px}'],
})
export class ContentConnectionsComponent {
  @Input() links: readonly ContentConnection[] = [];
}
