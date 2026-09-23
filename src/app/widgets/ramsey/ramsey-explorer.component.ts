import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  mixedWedges,
  monochromaticTriangles,
  pentagonMask,
  ramseyEdges,
  RamseyTriangle,
  resizeRamseyMask,
} from '../../shared/math/ramsey';
import { RamseyGraphComponent } from './ramsey-graph.component';

@Component({
  selector: 'app-ramsey-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, RamseyGraphComponent],
  templateUrl: './ramsey-explorer.component.html',
  styleUrl: './ramsey-widgets.css',
})
export class RamseyExplorerComponent {
  n = 5;
  mask = pentagonMask(5);
  triangles = monochromaticTriangles(this.n, this.mask);
  selected = -1;
  extension = 0;
  get redCount(): number {
    return this.triangles.filter((t) => t.red).length;
  }
  get selectedTriangle(): RamseyTriangle | undefined {
    return this.triangles[this.selected];
  }
  get wedgeSum(): number {
    return mixedWedges(this.n, this.mask).reduce((a, b) => a + b, 0);
  }
  get totalTriangles(): number {
    return this.n === 5 ? 10 : 20;
  }
  labels(vertices: number[]): string {
    return vertices.map((v) => String.fromCharCode(65 + v)).join('–');
  }
  refresh(): void {
    this.triangles = monochromaticTriangles(this.n, this.mask);
    this.selected = -1;
  }
  toggle(edge: number): void {
    this.mask ^= 1 << edge;
    this.refresh();
  }
  setSize(n: number): void {
    this.mask = resizeRamseyMask(this.n, n, this.mask);
    this.n = n;
    this.refresh();
  }
  preset(kind: string): void {
    if (kind === 'pentagon') {
      this.n = 5;
      this.mask = pentagonMask(5);
    }
    if (kind === 'minimum') {
      this.n = 6;
      this.mask = ramseyEdges(6).reduce(
        (m, e, i) => m | (e.a < 3 === e.b < 3 ? 1 << i : 0),
        0,
      );
    }
    if (kind === 'red') this.mask = (1 << ramseyEdges(this.n).length) - 1;
    if (kind === 'random')
      this.mask = Math.floor(Math.random() * (1 << ramseyEdges(this.n).length));
    this.refresh();
  }
  invert(): void {
    this.mask ^= (1 << ramseyEdges(this.n).length) - 1;
    this.refresh();
  }
  extend(): void {
    this.n = 6;
    this.mask = pentagonMask(6);
    ramseyEdges(6).forEach((e, i) => {
      if (e.b === 5 && this.extension & (1 << e.a)) this.mask |= 1 << i;
    });
    this.refresh();
  }
}
