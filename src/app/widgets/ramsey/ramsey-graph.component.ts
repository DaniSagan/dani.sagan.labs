import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ramseyEdges } from '../../shared/math/ramsey';

@Component({
  selector: 'app-ramsey-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ramsey-graph.component.html',
  styleUrl: './ramsey-graph.component.css',
})
export class RamseyGraphComponent implements OnChanges {
  @Input() n = 6;
  @Input() mask = 0;
  @Input() highlight: number[] = [];
  @Input() triangle: number[] = [];
  @Input() editable = false;
  @Input() selectable = false;
  @Input() pivot = -1;
  @Output() edgeToggle = new EventEmitter<number>();
  @Output() vertexSelect = new EventEmitter<number>();
  nodes: { x: number; y: number; label: string }[] = [];
  edges = ramseyEdges(6);
  polygon = '';
  ngOnChanges(changes: SimpleChanges): void {
    // Keep the same DOM edges during recoloring so keyboard focus is preserved.
    if (changes['n'] || !this.nodes.length) {
      this.nodes = Array.from({ length: this.n }, (_, i) => ({
        x: 250 + 182 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / this.n),
        y: 230 + 182 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / this.n),
        label: String.fromCharCode(65 + i),
      }));
      this.edges = ramseyEdges(this.n);
    }
    this.polygon = this.triangle
      .map((i) => `${this.nodes[i].x},${this.nodes[i].y}`)
      .join(' ');
  }
  red(i: number): boolean {
    return !!(this.mask & (1 << i));
  }
  edgeLabel(i: number): string {
    const e = this.edges[i];
    return `${this.nodes[e.a].label}–${this.nodes[e.b].label}: ${this.red(i) ? 'roja, continua' : 'azul, discontinua'}`;
  }
  toggle(i: number): void {
    if (this.editable) this.edgeToggle.emit(i);
  }
}
