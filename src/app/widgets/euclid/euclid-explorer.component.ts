import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { backSubstitutions, BackSubstitution, euclid, parseInteger } from './euclid.math';

@Component({
  selector: 'app-euclid-explorer', standalone: true,
  imports: [FormsModule],
  templateUrl: './euclid-explorer.component.html',
  styleUrl: './euclid-widgets.css'
})
export class EuclidExplorerComponent implements OnDestroy {
  aText = '252';
  bText = '198';
  result = euclid(252n, 198n);
  substitutions = backSubstitutions(this.result);
  step = 0;
  backStep = 0;
  error = '';
  private timer?: ReturnType<typeof setInterval>;
  readonly presets = [
    { label: '252 y 198', a: '252', b: '198' },
    { label: 'Coprimos', a: '35', b: '22' },
    { label: 'Orden inverso', a: '18', b: '48' },
    { label: 'Con signo', a: '-84', b: '30' },
    { label: 'Un cero', a: '0', b: '-42' },
    { label: 'Dos ceros', a: '0', b: '0' }
  ];

  get playing(): boolean { return this.timer !== undefined; }
  get bothZero(): boolean { return this.result.gcd === 0n; }
  get complete(): boolean { return this.step === this.result.divisions.length; }
  get current() { return this.step ? this.result.divisions[this.step - 1] : undefined; }
  get visibleRows() { return this.result.rows.slice(0, this.step + 2); }
  get usedPercent(): number {
    const row = this.current;
    return row && row.dividend !== 0n ? Number(row.dividend - row.remainder) / Number(row.dividend) * 100 : 0;
  }

  update(): void {
    this.pause();
    this.step = 0;
    this.backStep = 0;
    try {
      this.result = euclid(parseInteger(this.aText), parseInteger(this.bText));
      this.substitutions = backSubstitutions(this.result);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }

  preset(a: string, b: string): void { this.aText = a; this.bText = b; this.update(); }
  move(delta: number): void {
    this.pause();
    this.step = Math.max(0, Math.min(this.result.divisions.length, this.step + delta));
    this.backStep = 0;
  }
  restart(): void { this.pause(); this.step = 0; this.backStep = 0; }
  toggle(): void {
    if (this.playing) { this.pause(); return; }
    if (this.error || this.complete) { return; }
    this.timer = setInterval(() => {
      this.step++;
      if (this.complete) { this.pause(); }
    }, 1200);
  }
  pause(): void { clearInterval(this.timer); this.timer = undefined; }
  ngOnDestroy(): void { this.pause(); }

  expression(substitution: BackSubstitution, numeric = false): string {
    return substitution.terms.map(term =>
      `(${term.coefficient}) · ${numeric ? this.result.rows[term.index].remainder : 'R' + term.index}`
    ).join(' + ');
  }
}
