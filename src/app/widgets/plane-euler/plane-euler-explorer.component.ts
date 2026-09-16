import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { boundedPlaneFaces, cycleEdgeIndex, PLANE_EDGES, PLANE_POINTS, planeComponents, planeFaceLabel } from '../../shared/math/plane-graph';

@Component({
  selector: 'app-plane-euler-explorer', standalone: true, imports: [CommonModule],
  templateUrl: './plane-euler-explorer.component.html', styleUrl: './plane-euler-explorer.component.css'
})
export class PlaneEulerExplorerComponent implements OnDestroy {
  readonly points = PLANE_POINTS;
  readonly edges = PLANE_EDGES;
  readonly colors = ['#83dcc9', '#afa0fb', '#f2bd86', '#8ebfee', '#ec9fc5', '#cbda8f', '#83d4e3', '#c6abf2', '#f5d25e'];
  enabled = this.edges.map((_, i) => i < 12);
  faces: { path: string; x: number; y: number; boundary: number[] }[] = [];
  components = 1;
  edgeCount = 12;
  roots: number[] = [];
  selectedFace = -1;
  showComponents = false;
  running = false;
  message = 'Pulsa una arista para retirarla o una línea discontinua para añadirla. La región exterior también cuenta.';
  history: boolean[][] = [];
  private timer?: ReturnType<typeof setInterval>;
  constructor() { this.recount(); }
  get faceCount(): number { return this.faces.length + 1; }
  get balance(): number { return this.points.length - this.edgeCount + this.faceCount; }
  private recount(): void {
    const edges = this.edges.filter((_, i) => this.enabled[i]);
    this.edgeCount = edges.length;
    const roots = planeComponents(this.points.length, edges);
    const distinct = [...new Set(roots)];
    this.roots = roots.map(r => distinct.indexOf(r));
    this.components = distinct.length;
    this.faces = boundedPlaneFaces(this.points, edges).map(boundary => ({
      boundary, path: 'M' + boundary.map(i => `${this.points[i].x},${this.points[i].y}`).join('L') + 'Z',
      ...planeFaceLabel(this.points, boundary)
    }));
    this.selectedFace = -1;
  }
  load(name: string): void {
    this.stop(); this.history = [];
    this.enabled = this.edges.map((_, i) => name === 'mesh' || (name === 'grid' && i < 12) ||
      (name === 'tree' && [0,1,2,3,4,5,6,7].includes(i)) || (name === 'islands' && [0,6,12,5,11,15].includes(i)));
    this.recount();
    this.message = name === 'islands' ? 'Dos triángulos y tres vértices aislados: cinco componentes, pero una sola cara exterior.' : 'Los nueve vértices permanecen presentes, incluso cuando quedan aislados. Prueba a cambiar una arista.';
  }
  toggle(index: number, animated = false): void {
    if (!animated) this.stop();
    this.history.push([...this.enabled]);
    const previousFaces = this.faceCount, previousComponents = this.components;
    this.enabled[index] = !this.enabled[index]; this.recount();
    const added = this.enabled[index];
    this.message = this.components !== previousComponents
      ? (added ? 'Has unido dos componentes: A aumenta en 1, k disminuye en 1 y F no cambia.' : 'Era una arista puente: A disminuye en 1, k aumenta en 1 y F no cambia.')
      : (this.faceCount > previousFaces ? 'Has cerrado un ciclo: A y F aumentan en 1. El balance se conserva.' : 'Has abierto un ciclo: A y F disminuyen en 1. Dos caras se han fusionado.');
  }
  undo(): void {
    this.stop(); const state = this.history.pop();
    if (state) { this.enabled = state; this.recount(); this.message = 'Último cambio deshecho.'; }
  }
  proofStep(): boolean {
    const indices = this.edges.map((_, i) => i).filter(i => this.enabled[i]);
    const index = cycleEdgeIndex(this.points.length, indices.map(i => this.edges[i]));
    if (index < 0) {
      this.stop(); this.message = `Queda un bosque: A = V − k = ${this.points.length} − ${this.components} = ${this.edgeCount}, y F = 1. Por tanto, V − A + F = 1 + k.`;
      return false;
    }
    this.toggle(indices[index], true); return true;
  }
  animateProof(): void {
    this.stop(); this.running = true;
    if (!this.proofStep()) return;
    this.timer = setInterval(() => { if (!document.hidden) this.proofStep(); }, 1300);
  }
  stop(): void { if (this.timer !== undefined) clearInterval(this.timer); this.timer = undefined; this.running = false; }
  ngOnDestroy(): void { this.stop(); }
}
