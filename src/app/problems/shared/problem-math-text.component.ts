import { Component, Input } from '@angular/core';
import { FormulaComponent } from '../../shared/math/formula/formula.component';

export interface ProblemTextPart { kind: 'text' | 'formula'; value: string; }

/** Explicit TeX delimiters keep prose as text and equations in the shared formula component. */
export function problemTextParts(text: string): ProblemTextPart[] {
  const parts: ProblemTextPart[] = [];
  const pattern = /\\\(([\s\S]*?)\\\)/g;
  let end = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const start = match.index!;
    if (start > end) parts.push({ kind: 'text', value: text.slice(end, start) });
    parts.push({ kind: 'formula', value: match[1] });
    end = start + match[0].length;
  }
  if (end < text.length) parts.push({ kind: 'text', value: text.slice(end) });
  return parts;
}

@Component({
  selector: 'app-problem-math-text', standalone: true, imports: [FormulaComponent],
  template: `@for (part of parts; track $index) {
    @if (part.kind === 'formula') {
      <span class="math-part"><app-formula [expression]="part.value" displayMode="inline" [showCodeButton]="false" /></span>
    } @else { {{ part.value }} }
  }`,
  styles: [`:host { display: inline; } .math-part { display: inline-block; max-width: 100%; vertical-align: middle; overflow-x: auto; overflow-y: hidden; }`]
})
export class ProblemMathTextComponent {
  parts: ProblemTextPart[] = [];
  @Input({ required: true }) set text(value: string) { this.parts = problemTextParts(value ?? ''); }
}
