import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseInteger } from '../euclid/euclid.math';
import { modulo } from '../modular/modular.math';
import { CrtResult, solveCongruences, satisfies } from './crt.math';

@Component({
  selector: 'app-crt-explorer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crt-explorer.component.html',
  styleUrls: ['../modular/modular-widgets.css', './crt-explorer.component.css'],
})
export class CrtExplorerComponent implements OnDestroy {
  rows = [
    { residue: '2', modulus: '3' },
    { residue: '3', modulus: '5' },
  ];
  result: CrtResult = solveCongruences([
    { residue: 2n, modulus: 3n },
    { residue: 3n, modulus: 5n },
  ]);
  error = '';
  cursor = 0n;
  step = 0;
  selector = 0;
  playing = false;
  readonly one = 1n;
  private timer?: ReturnType<typeof setInterval>;
  readonly offsets = Array.from({ length: 41 }, (_, i) => i - 20);
  readonly samples = [-2n, -1n, 0n, 1n, 2n];
  update(): void {
    this.pause();
    this.step = 0;
    this.selector = 0;
    this.cursor = 0n;
    try {
      this.result = solveCongruences(
        this.rows.map((row) => ({
          residue: parseInteger(row.residue),
          modulus: parseInteger(row.modulus),
        })),
      );
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(kind: number): void {
    const cases = [
      [
        ['2', '3'],
        ['3', '5'],
      ],
      [
        ['2', '3'],
        ['3', '5'],
        ['2', '7'],
      ],
      [
        ['2', '6'],
        ['5', '9'],
      ],
      [
        ['0', '2'],
        ['1', '4'],
      ],
      [
        ['-1', '4'],
        ['13', '6'],
        ['7', '12'],
      ],
      [
        ['0', '1'],
        ['2', '3'],
      ],
    ];
    this.rows = cases[kind].map(([residue, modulus]) => ({ residue, modulus }));
    this.update();
  }
  add(): void {
    if (this.rows.length < 6) {
      this.rows.push({ residue: '0', modulus: '2' });
      this.update();
    }
  }
  remove(index: number): void {
    if (this.rows.length > 2) {
      this.rows.splice(index, 1);
      this.update();
    }
  }
  moveStep(delta: number): void {
    this.step = Math.max(
      0,
      Math.min(this.result.steps.length - 1, this.step + delta),
    );
  }
  move(delta: number): void {
    this.pause();
    this.cursor += BigInt(delta);
  }
  jump(): void {
    this.pause();
    if (this.result.solution) {
      this.cursor = this.result.solution.residue;
    }
  }
  play(): void {
    if (this.playing) {
      this.pause();
      return;
    }
    this.playing = true;
    let ticks = 0;
    this.timer = setInterval(() => {
      this.cursor++;
      ticks++;
      if (satisfies(this.cursor, this.result.equations) || ticks >= 200) {
        this.pause();
      }
    }, 500);
  }
  pause(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = undefined;
    this.playing = false;
  }
  ngOnDestroy(): void {
    this.pause();
  }
  point(offset: number): bigint {
    return this.cursor + BigInt(offset);
  }
  hit(offset: number, index: number): boolean {
    const row = this.result.equations[index];
    return modulo(this.point(offset), row.modulus) === row.residue;
  }
  common(offset: number): boolean {
    return satisfies(this.point(offset), this.result.equations);
  }
  get coincidences(): string {
    return this.offsets
      .filter((i) => this.common(i))
      .map((i) => this.point(i).toString())
      .join(', ');
  }
  get clocksVisible(): boolean {
    return this.result.equations.every((row) => row.modulus <= 24n);
  }
  ticks(modulus: bigint): number[] {
    return Array.from({ length: Number(modulus) }, (_, i) => i);
  }
  position(
    value: number,
    modulus: bigint,
    radius = 65,
  ): { x: number; y: number } {
    const angle = (2 * Math.PI * value) / Number(modulus) - Math.PI / 2;
    return {
      x: 100 + radius * Math.cos(angle),
      y: 100 + radius * Math.sin(angle),
    };
  }
  residue(index: number): number {
    return Number(modulo(this.cursor, this.result.equations[index].modulus));
  }
  verification(index: number): bigint {
    return modulo(
      this.result.solution!.residue,
      this.result.equations[index].modulus,
    );
  }
}
