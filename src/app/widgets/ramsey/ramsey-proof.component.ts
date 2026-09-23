import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ramseyEdges, ramseyWitness } from '../../shared/math/ramsey';
import { RamseyGraphComponent } from './ramsey-graph.component';

@Component({
  selector: 'app-ramsey-proof',
  standalone: true,
  imports: [CommonModule, FormsModule, RamseyGraphComponent],
  templateUrl: './ramsey-proof.component.html',
  styleUrl: './ramsey-widgets.css',
})
export class RamseyProofComponent {
  mask = 715;
  pivot = 0;
  step = 0;
  witness = ramseyWitness(this.mask, this.pivot);
  readonly steps = [
    'Elegir un vértice',
    'Agrupar cinco aristas',
    'Mirar entre tres vecinos',
    'Encontrar el triángulo',
  ];
  labels(vertices: number[]): string {
    return vertices.map((v) => String.fromCharCode(65 + v)).join(', ');
  }
  get highlight(): number[] {
    if (this.step === 0)
      return ramseyEdges(6)
        .map((e, i) => (e.a === this.pivot || e.b === this.pivot ? i : -1))
        .filter((i) => i >= 0);
    if (this.step === 1) return this.witness.spokes;
    if (this.step === 2) return [...this.witness.spokes, ...this.witness.inner];
    return this.witness.triangle.edges;
  }
  update(): void {
    this.witness = ramseyWitness(this.mask, this.pivot);
  }
  toggle(edge: number): void {
    this.mask ^= 1 << edge;
    this.update();
  }
  select(pivot: number): void {
    this.pivot = pivot;
    this.update();
  }
  randomize(): void {
    this.mask = Math.floor(Math.random() * 32768);
    this.update();
  }
  branch(opposite: boolean): void {
    this.pivot = 0;
    this.mask = 0;
    ramseyEdges(6).forEach((e, i) => {
      if ((e.a === 0 && e.b <= 3) || (!opposite && e.a === 1 && e.b === 2))
        this.mask |= 1 << i;
    });
    this.step = 2;
    this.update();
  }
}
