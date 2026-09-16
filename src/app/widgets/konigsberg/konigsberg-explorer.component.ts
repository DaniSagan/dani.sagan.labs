import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { analyzeBridges, Bridge, eulerianRoute, KONIGSBERG_BRIDGES } from '../../shared/math/eulerian-graph';

interface DrawnBridge extends Bridge { active: boolean; path: string; midX: number; midY: number; controlX: number; controlY: number; }

@Component({
  selector: 'app-konigsberg-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './konigsberg-explorer.component.html', styleUrl: './konigsberg-explorer.component.css'
})
export class KonigsbergExplorerComponent implements OnDestroy {
  readonly regions = [
    { label: 'A', name: 'Isla central', x: 320, y: 250 },
    { label: 'B', name: 'Orilla norte', x: 390, y: 65 },
    { label: 'C', name: 'Orilla sur', x: 390, y: 435 },
    { label: 'D', name: 'Isla oriental', x: 690, y: 250 }
  ];
  readonly pairs = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 3 }];
  bridges: DrawnBridge[] = [];
  analysis = analyzeBridges(KONIGSBERG_BRIDGES);
  abstraction = 0;
  editing = false;
  current: number | null = null;
  start: number | null = null;
  visited: number[] = [];
  steps: number[] = [];
  message = 'Elige una región para comenzar. Después cruza un puente iluminado.';
  auto = false;
  moving = false;
  walker = { x: 320, y: 250 };
  private timer?: ReturnType<typeof setInterval>;
  private frame = 0;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() { this.load('original'); }
  get active(): DrawnBridge[] { return this.bridges.filter(b => b.active); }
  get complete(): boolean { return !!this.active.length && this.steps.length === this.active.length; }
  get status(): string {
    if (this.analysis.kind === 'empty') return 'No hay puentes activos';
    if (!this.analysis.connected) return 'Imposible: hay componentes separadas';
    if (this.analysis.kind === 'impossible') return 'Imposible: cuatro regiones impares';
    return this.analysis.kind === 'open' ? 'Existe un recorrido abierto' : 'Existe un circuito cerrado';
  }
  get explanation(): string {
    if (this.analysis.kind === 'empty') return 'Añade un puente para explorar el criterio.';
    if (!this.analysis.connected) return 'No se puede saltar entre grupos de puentes desconectados, aunque sus grados sean pares.';
    if (this.analysis.kind === 'open') return `Los extremos deben ser ${this.regions[this.analysis.odd[0]].label} y ${this.regions[this.analysis.odd[1]].label}.`;
    if (this.analysis.kind === 'circuit') return 'Todos los grados son pares. Puedes empezar en cualquier región con puentes y regresar a ella.';
    return 'Un recorrido solo dispone de dos extremos: no puede compensar cuatro grados impares.';
  }
  private refresh(): void { this.analysis = analyzeBridges(this.active); }
  load(preset: string): void {
    this.reset();
    const edges = KONIGSBERG_BRIDGES.map(e => ({ ...e, active: true }));
    if (preset === 'open') edges[0].active = false;
    if (preset === 'circuit') edges.push({ id: 8, a: 0, b: 1, active: true }, { id: 9, a: 2, b: 3, active: true });
    if (preset === 'disconnected') {
      edges.forEach(e => e.active = e.id <= 2 || e.id === 7);
      edges.push({ id: 8, a: 2, b: 3, active: true });
    }
    this.bridges = edges.map(e => ({ ...e, ...this.geometry(e, edges) }));
    this.refresh();
  }
  private geometry(edge: Bridge, all: Bridge[]) {
    const a = this.regions[edge.a], b = this.regions[edge.b];
    const parallel = all.filter(e => e.a === edge.a && e.b === edge.b);
    const index = parallel.findIndex(e => e.id === edge.id);
    const offset = (index - (parallel.length - 1) / 2) * 145;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    let controlX = (a.x + b.x) / 2 - (b.y - a.y) / length * offset;
    let controlY = (a.y + b.y) / 2 + (b.x - a.x) / length * offset;
    if (edge.a === 1 && edge.b === 2) controlX = 85 + offset;
    const midX = (a.x + 2 * controlX + b.x) / 4;
    const midY = (a.y + 2 * controlY + b.y) / 4;
    return { path: `M ${a.x} ${a.y} Q ${controlX} ${controlY} ${b.x} ${b.y}`, controlX, controlY, midX, midY };
  }
  setEditing(): void { this.reset(); }
  toggleBridge(bridge: DrawnBridge): void {
    this.reset(); bridge.active = !bridge.active; this.refresh();
  }
  addBridge(a: number, b: number): void {
    if (this.bridges.length >= 16) return;
    this.reset();
    const edge = { id: Math.max(...this.bridges.map(e => e.id)) + 1, a, b, active: true };
    this.bridges.push({ ...edge, path: '', midX: 0, midY: 0, controlX: 0, controlY: 0 });
    this.bridges.forEach(e => Object.assign(e, this.geometry(e, this.bridges)));
    this.refresh();
  }
  chooseRegion(index: number): void {
    if (this.editing || this.steps.length || this.auto || this.moving) return;
    if (!this.analysis.degrees[index]) { this.message = 'Esta región no tiene puentes activos.'; return; }
    this.start = this.current = index; this.visited = [index];
    this.walker = { x: this.regions[index].x, y: this.regions[index].y };
    this.message = `Empiezas en ${this.regions[index].label}. Elige uno de sus puentes.`;
  }
  available(bridge: DrawnBridge): boolean {
    return bridge.active && !this.steps.includes(bridge.id) && this.current !== null && (bridge.a === this.current || bridge.b === this.current);
  }
  clickBridge(bridge: DrawnBridge): void {
    if (this.editing) { this.toggleBridge(bridge); return; }
    if (this.auto || this.moving) return;
    if (!this.available(bridge)) { this.message = this.current === null ? 'Primero elige una región de salida.' : 'Elige un puente sin usar que conecte con tu posición actual.'; return; }
    this.cross(bridge);
  }
  private cross(bridge: DrawnBridge): void {
    const previous = this.current!;
    this.current = bridge.a === previous ? bridge.b : bridge.a;
    this.steps.push(bridge.id); this.visited.push(this.current);
    this.animateCrossing(bridge, previous);
    if (this.complete) this.message = `¡Recorrido completo! ${this.steps.length} puentes, ninguno repetido. ${this.current === this.start ? 'Has regresado al inicio.' : 'Los extremos son distintos.'}`;
    else if (!this.active.some(e => this.available(e))) this.message = `Sin salida en ${this.regions[this.current].label}: quedan ${this.active.length - this.steps.length} puentes. Deshaz un paso o reinicia.`;
    else this.message = `Estás en ${this.regions[this.current].label}. Llevas ${this.steps.length} de ${this.active.length} puentes.`;
  }
  private animateCrossing(edge: DrawnBridge, from: number): void {
    cancelAnimationFrame(this.frame);
    const a = this.regions[edge.a], b = this.regions[edge.b];
    if (this.reducedMotion) { this.walker = { ...this.regions[this.current!] }; return; }
    this.moving = true;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 650, 1);
      const eased = progress * progress * (3 - 2 * progress);
      const t = from === edge.a ? eased : 1 - eased;
      this.walker = { x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * edge.controlX + t ** 2 * b.x,
        y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * edge.controlY + t ** 2 * b.y };
      if (progress < 1) this.frame = requestAnimationFrame(tick);
      else { this.moving = false; this.frame = 0; }
    };
    this.frame = requestAnimationFrame(tick);
  }
  undo(): void {
    if (!this.steps.length) return;
    this.stop(); this.steps.pop(); this.visited.pop(); this.current = this.visited[this.visited.length - 1];
    this.walker = { ...this.regions[this.current] }; this.message = 'Último cruce deshecho. Puedes probar otra elección.';
  }
  solve(): void {
    this.reset(); this.editing = false;
    const route = eulerianRoute(this.active);
    if (!route) { this.message = this.status + '. ' + this.explanation; return; }
    this.chooseRegion(route.vertices[0]); this.auto = true;
    let index = 0;
    this.timer = setInterval(() => {
      if (document.hidden) return;
      if (index >= route.edges.length) { clearInterval(this.timer); this.timer = undefined; this.auto = false; return; }
      const bridgeId = route.edges[index++];
      this.cross(this.bridges.find(e => e.id === bridgeId)!);
    }, 1000);
  }
  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined; this.auto = false;
    cancelAnimationFrame(this.frame); this.frame = 0; this.moving = false;
    if (this.current !== null) this.walker = { ...this.regions[this.current] };
  }
  reset(): void {
    this.stop(); this.current = this.start = null; this.steps = []; this.visited = [];
    this.message = 'Elige una región para comenzar. Después cruza un puente iluminado.';
  }
  ngOnDestroy(): void { this.stop(); }
}
