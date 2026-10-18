import { Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TextLink { term: string; route: string; fragment?: string; }

/** Plain text with explicit, caller-owned links; never interprets HTML. */
@Component({
  selector: 'app-linked-text', standalone: true, imports: [RouterLink],
  template: '@for (part of parts; track $index) { @if (part.route) {<a [routerLink]="part.route" [fragment]="part.fragment">{{ part.text }}</a>} @else { {{ part.text }} } }',
  styles: [':host { display: inline; }'],
})
export class LinkedTextComponent implements OnChanges {
  @Input() text = '';
  @Input() links: readonly TextLink[] = [];
  parts: { text: string; route?: string; fragment?: string }[] = [];

  ngOnChanges(): void {
    const links = [...this.links].filter(link => link.term.length > 0).sort((a,b) => b.term.length - a.term.length);
    if (!links.length) { this.parts = [{ text: this.text }]; return; }
    const quote = (s: string) => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
    const pattern = new RegExp('(?<![\\p{L}\\p{N}])(?:' + links.map(link => quote(link.term)).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
    const byTerm = new Map(links.map(link => [link.term.toLocaleLowerCase('es'), link]));
    this.parts = [];
    let start = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(this.text)) !== null) {
      const index = match.index!;
      if (index > start) this.parts.push({ text: this.text.slice(start, index) });
      const link = byTerm.get(match[0].toLocaleLowerCase('es'))!;
      this.parts.push({ text: match[0], route: link.route, fragment: link.fragment });
      start = index + match[0].length;
    }
    if (start < this.text.length) this.parts.push({ text: this.text.slice(start) });
  }
}
