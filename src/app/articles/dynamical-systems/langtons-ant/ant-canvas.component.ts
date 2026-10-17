import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { AntEngine } from './langtons-ant.model';

@Component({ selector: 'app-ant-canvas', standalone: true,
  template: `<canvas #canvas tabindex="0" role="img" [attr.aria-label]="label" (keydown)="keyboard($event)" (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="end()" (pointercancel)="end()" (wheel)="wheel($event)"></canvas>`,
  styles: [`:host{display:block;min-width:0}canvas{display:block;width:100%;height:clamp(260px,48vh,530px);background:#fff;touch-action:none;border-radius:8px;outline-offset:3px}canvas:focus-visible{outline:3px solid var(--accent2)}@media(max-width:600px){canvas{height:clamp(240px,32vh,300px)}}`] })
export class AntCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  @Input() engine!: AntEngine;
  @Input() revision = 0;
  @Input() colors = ['#ffffff', '#17171c', '#e8643a', '#4a9eff', '#a8e6a0', '#d4a843', '#9863c4', '#ff8cb5', '#359b8c', '#8c6839', '#d65464', '#57704b'];
  @Input() follow = true;
  @Input() grid = true;
  @Input() mode = 'pan';
  @Input() phase = 0;
  @Input() label = 'Tablero de la hormiga. Arrastra para desplazar; usa los controles para editar y acercar.';
  @Input() difference?: AntEngine;
  @Output() followChange = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<{ x: number; y: number; first: boolean }>();
  zoom = 9; cx = 0; cy = 0;
  private drag?: { x: number; y: number; last: string };
  private observer?: ResizeObserver;
  ngAfterViewInit(): void { this.observer = new ResizeObserver(() => this.draw()); this.observer.observe(this.canvas!.nativeElement); this.draw(); }
  ngOnChanges(): void { this.draw(); }
  ngOnDestroy(): void { this.observer?.disconnect(); }
  center(): void { this.cx = this.engine.ants[0].x; this.cy = this.engine.ants[0].y; this.draw(); }
  fit(): void {
    const b = [...this.engine.bounds];
    for (const k of this.engine.cells.keys()) { const [x, y] = k.split(',').map(Number); b[0] = Math.min(b[0], x); b[1] = Math.max(b[1], x); b[2] = Math.min(b[2], y); b[3] = Math.max(b[3], y); }
    this.cx = (b[0] + b[1]) / 2; this.cy = (b[2] + b[3]) / 2;
    const r = this.canvas!.nativeElement.getBoundingClientRect(); this.zoom = Math.max(.3, Math.min(36, r.width / (b[1] - b[0] + 12), r.height / (b[3] - b[2] + 12))); this.draw();
  }
  scale(factor: number): void { this.zoom = Math.max(.3, Math.min(44, this.zoom * factor)); this.draw(); }
  wheel(e: WheelEvent): void { e.preventDefault(); this.scale(e.deltaY < 0 ? 1.15 : 1 / 1.15); }
  keyboard(e: KeyboardEvent): void {
    const moves: Record<string, [number, number]> = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] };
    if (moves[e.key]) { e.preventDefault(); this.follow = false; this.followChange.emit(false); this.cx += moves[e.key][0]; this.cy += moves[e.key][1]; this.draw(); }
    if (e.key === '+' || e.key === '=') this.scale(1.2); if (e.key === '-') this.scale(1 / 1.2);
  }
  down(e: PointerEvent): void {
    if (e.button !== 0) return;
    e.preventDefault(); this.canvas!.nativeElement.setPointerCapture(e.pointerId);
    this.drag = { x: e.clientX, y: e.clientY, last: '' };
    if (this.mode !== 'pan') this.paint(e, true); else { this.follow = false; this.followChange.emit(false); }
  }
  move(e: PointerEvent): void {
    if (!this.drag) return;
    if (this.mode === 'pan') { this.cx -= (e.clientX - this.drag.x) / this.zoom; this.cy += (e.clientY - this.drag.y) / this.zoom; this.drag.x = e.clientX; this.drag.y = e.clientY; this.draw(); }
    else this.paint(e, false);
  }
  end(): void { this.drag = undefined; }
  private paint(e: PointerEvent, first: boolean): void {
    const r = this.canvas!.nativeElement.getBoundingClientRect(), x = Math.floor((e.clientX - r.left - r.width / 2) / this.zoom + this.cx + .5), y = Math.floor(-(e.clientY - r.top - r.height / 2) / this.zoom + this.cy + .5);
    const k = `${x},${y}`; if (this.drag!.last === k) return; this.drag!.last = k; this.edit.emit({ x, y, first });
  }
  draw(): void {
    if (!this.canvas || !this.engine) return;
    const c = this.canvas.nativeElement, r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
    const ctx = c.getContext('2d')!; ctx.scale(dpr, dpr); ctx.fillStyle = this.colors[0]; ctx.fillRect(0, 0, r.width, r.height);
    if (this.follow) { this.cx = this.engine.ants[0].x; this.cy = this.engine.ants[0].y; }
    const z = this.zoom, px = (x: number) => r.width / 2 + (x - this.cx - .5) * z, py = (y: number) => r.height / 2 - (y - this.cy + .5) * z;
    for (const [k, state] of this.engine.cells) {
      const [x, y] = k.split(',').map(Number), sx = px(x), sy = py(y);
      if (sx < -z || sy < -z || sx > r.width || sy > r.height) continue;
      ctx.fillStyle = this.colors[state]; ctx.fillRect(sx, sy, Math.max(1, z), Math.max(1, z));
    }
    if (this.difference) {
      const keys = new Set([...this.engine.cells.keys(), ...this.difference.cells.keys()]);
      ctx.fillStyle = '#e8643a99';
      for (const k of keys) { const [x, y] = k.split(',').map(Number); if (this.engine.get(x, y) !== this.difference.get(x, y)) ctx.fillRect(px(x), py(y), Math.max(1, z), Math.max(1, z)); }
    }
    if (this.grid && z >= 5) {
      ctx.strokeStyle = '#00000016'; ctx.lineWidth = .5; ctx.beginPath();
      for (let x = Math.floor(this.cx - r.width / z / 2); x <= this.cx + r.width / z / 2 + 1; x++) { ctx.moveTo(px(x), 0); ctx.lineTo(px(x), r.height); }
      for (let y = Math.floor(this.cy - r.height / z / 2); y <= this.cy + r.height / z / 2 + 1; y++) { ctx.moveTo(0, py(y)); ctx.lineTo(r.width, py(y)); } ctx.stroke();
    }
    const active = this.engine.steps % this.engine.ants.length;
    if (this.phase) {
      const a = this.engine.ants[active];
      if (this.phase >= 4) { ctx.fillStyle = this.colors[(this.engine.get(a.x, a.y) + 1) % this.engine.rule.length]; ctx.fillRect(px(a.x), py(a.y), z, z); }
      ctx.strokeStyle = '#c9441b'; ctx.lineWidth = 3; ctx.strokeRect(px(a.x) - 2, py(a.y) - 2, z + 4, z + 4);
    }
    this.engine.ants.forEach((ant, i) => {
      const a = { ...ant };
      if (this.phase >= 3 && i === active) a.d = (a.d + (this.engine.rule[this.engine.get(a.x, a.y)] === 'R' ? 1 : 3)) % 4;
      ctx.save(); ctx.translate(px(a.x) + z / 2, py(a.y) + z / 2); ctx.rotate(a.d * Math.PI / 2);
      const size = Math.max(5, z * .65); ctx.fillStyle = i % 2 ? '#2867b2' : '#c9441b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size * .65, size * .6); ctx.lineTo(0, size * .2); ctx.lineTo(-size * .65, size * .6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      if (this.engine.ants.length > 1) { ctx.fillStyle = '#b02b10'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(String(i + 1), px(a.x) + z, py(a.y)); }
    });
  }
  png(): void { const a = document.createElement('a'); a.download = `langton-${this.engine.steps}.png`; a.href = this.canvas!.nativeElement.toDataURL(); a.click(); }
}
