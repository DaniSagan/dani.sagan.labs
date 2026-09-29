import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DiophantineResult,
  IntegerPoint,
  SolutionConstraints,
  allowed,
} from './diophantine.math';

@Component({
  selector: 'app-diophantine-lattice',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './diophantine-lattice.component.html',
  styleUrls: [
    '../modular/modular-widgets.css',
    './diophantine-lattice.component.css',
  ],
})
export class DiophantineLatticeComponent implements OnChanges {
  @Input({ required: true }) result!: DiophantineResult;
  @Input() selected: IntegerPoint | null = null;
  @Input({ required: true }) constraints!: SolutionConstraints;
  span = 12;
  follow = false;
  center: IntegerPoint = { x: 0n, y: 0n };
  points: {
    x: bigint;
    y: bigint;
    dx: number;
    dy: number;
    solution: boolean;
    allowed: boolean;
  }[] = [];
  marks: number[] = [];
  segment: { x1: number; y1: number; x2: number; y2: number } | null = null;
  ngOnChanges(): void {
    this.refresh();
  }
  px(dx: number): number {
    return 260 + (dx * 230) / this.span;
  }
  py(dy: number): number {
    return 260 - (dy * 230) / this.span;
  }
  refresh(): void {
    this.center =
      this.follow && this.selected ? this.selected : { x: 0n, y: 0n };
    this.marks = Array.from(
      { length: this.span * 2 + 1 },
      (_, i) => i - this.span,
    );
    this.points = this.marks.flatMap((dx) =>
      this.marks.map((dy) => {
        const p = {
          x: this.center.x + BigInt(dx),
          y: this.center.y + BigInt(dy),
        };
        return {
          ...p,
          dx,
          dy,
          solution: this.result.a * p.x + this.result.b * p.y === this.result.c,
          allowed: allowed(p, this.constraints),
        };
      }),
    );
    const a = Number(this.result.a),
      b = Number(this.result.b);
    const c = Number(
      this.result.c -
        this.result.a * this.center.x -
        this.result.b * this.center.y,
    );
    const candidates: { x: number; y: number }[] = [];
    const add = (x: number, y: number) => {
      if (
        Math.abs(x) <= this.span + 1e-9 &&
        Math.abs(y) <= this.span + 1e-9 &&
        !candidates.some((p) => Math.abs(p.x - x) + Math.abs(p.y - y) < 1e-9)
      ) {
        candidates.push({ x, y });
      }
    };
    if (b !== 0) {
      for (const x of [-this.span, this.span]) {
        add(x, (c - a * x) / b);
      }
    }
    if (a !== 0) {
      for (const y of [-this.span, this.span]) {
        add((c - b * y) / a, y);
      }
    }
    this.segment =
      candidates.length >= 2
        ? {
            x1: this.px(candidates[0].x),
            y1: this.py(candidates[0].y),
            x2: this.px(candidates[1].x),
            y2: this.py(candidates[1].y),
          }
        : null;
  }
  locate(p: IntegerPoint | null): { x: number; y: number } | null {
    if (!p) {
      return null;
    }
    const dx = p.x - this.center.x,
      dy = p.y - this.center.y;
    if (
      dx < -BigInt(this.span) ||
      dx > BigInt(this.span) ||
      dy < -BigInt(this.span) ||
      dy > BigInt(this.span)
    ) {
      return null;
    }
    return { x: this.px(Number(dx)), y: this.py(Number(dy)) };
  }
  get next(): IntegerPoint | null {
    return this.selected && this.result.direction
      ? {
          x: this.selected.x + this.result.direction.x,
          y: this.selected.y + this.result.direction.y,
        }
      : null;
  }
  get visibleSolutions(): number {
    return this.points.filter((p) => p.solution).length;
  }
}
