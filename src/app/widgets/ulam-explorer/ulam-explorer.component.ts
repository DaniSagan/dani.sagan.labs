import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  classifyPrime,
  PrimeState,
  spiralPosition,
  spiralValue,
} from '../../shared/math/ulam';

interface Cell {
  n: bigint;
  x: number;
  y: number;
  state: PrimeState | 'pending';
}
@Component({
  selector: 'app-ulam-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ulam-explorer.component.html',
  styleUrl: './ulam-explorer.component.css',
})
export class UlamExplorerComponent implements AfterViewInit, OnDestroy {
  endInput = '10000';
  targetInput = '1';
  end = 10000n;
  cx = 0n;
  cy = 0n;
  cellSize = 15;
  viewportSize = 600;
  @ViewChild('viewport') viewport?: ElementRef<HTMLImageElement>;
  private resizeObserver?: ResizeObserver;
  labels = false;
  imageUrl = '';
  private readonly bitmap = document.createElement('canvas');
  private readonly snapshot = document.createElement('canvas');
  private lastSnapshot = 0;
  cells: Cell[] = [];
  selected: Cell | null = null;
  error = '';
  running = false;
  completed = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private test?: Generator<void, PrimeState>;
  private cache = new Map<bigint, PrimeState>();
  constructor(private readonly zone: NgZone) {
    this.render();
  }
  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width > 0 && width !== this.viewportSize) {
        this.zone.run(() => {
          this.viewportSize = width;
          this.render();
        });
      }
    });
    if (this.viewport) this.resizeObserver.observe(this.viewport.nativeElement);
  }
  get radius(): number {
    return Math.max(0, Math.floor((this.viewportSize / this.cellSize - 1) / 2));
  }
  get size(): number {
    return 2 * this.radius + 1;
  }
  get pitch(): number {
    return this.cellSize;
  }
  get offset(): number {
    return (this.viewportSize - this.size * this.cellSize) / 2;
  }
  parse(text: string): bigint {
    if (!/^[0-9]+$/.test(text.trim()) || BigInt(text.trim()) < 1n)
      throw new Error('Introduce un entero positivo decimal.');
    return BigInt(text.trim());
  }
  apply(last = false): void {
    try {
      const end = this.parse(this.endInput),
        target = last ? end : this.parse(this.targetInput);
      if (target > end)
        throw new Error('El destino debe estar dentro del tramo 1…N.');
      const position = spiralPosition(target);
      this.end = end;
      this.cx = position.x;
      this.cy = position.y;
      this.targetInput = target.toString();
      this.error = '';
      this.render();
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  origin(): void {
    this.targetInput = '1';
    this.apply();
  }
  pan(dx: number, dy: number): void {
    this.cx += BigInt(dx * Math.max(1, this.radius));
    this.cy += BigInt(dy * Math.max(1, this.radius));
    this.render();
  }
  render(): void {
    this.stop();
    this.cells = [];
    this.selected = null;
    this.completed = 0;
    for (let row = 0; row < this.size; row++)
      for (let col = 0; col < this.size; col++) {
        const n = spiralValue(
          this.cx + BigInt(col - this.radius),
          this.cy + BigInt(this.radius - row),
        );
        if (n <= this.end)
          this.cells.push({
            n,
            x: this.offset + col * this.pitch,
            y: this.offset + row * this.pitch,
            state: this.cache.get(n) ?? 'pending',
          });
      }
    this.selected =
      this.cells.find((c) => c.n === spiralValue(this.cx, this.cy)) ?? null;
    this.redrawImage();
    this.running = this.cells.length > 0;
    if (this.running) this.schedule();
  }
  private schedule(): void {
    this.timer = setTimeout(() => this.work(), 16);
  }
  private work(): void {
    this.timer = undefined;
    const deadline = performance.now() + 8;
    for (let i = 0; i < 2000 && this.completed < this.cells.length; i++) {
      const cell = this.cells[this.completed];
      if (cell.state !== 'pending') this.completed++;
      else {
        this.test ??= classifyPrime(cell.n);
        const step = this.test.next();
        if (step.done) {
          cell.state = step.value;
          this.paintCell(cell);
          this.test = undefined;
          this.completed++;
          if (this.cache.size >= 20000)
            this.cache.delete(this.cache.keys().next().value!);
          this.cache.set(cell.n, cell.state);
        }
      }
      if (performance.now() >= deadline) break;
    }
    this.running = this.completed < this.cells.length;
    if (!this.running || performance.now() - this.lastSnapshot >= 150)
      this.publishImage();
    if (this.running) this.schedule();
  }
  stop(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    this.test = undefined;
    this.running = false;
    if (this.imageUrl) this.publishImage();
  }
  resume(): void {
    if (this.completed < this.cells.length && !this.running) {
      this.running = true;
      this.schedule();
    }
  }
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.stop();
  }
  inspect(event: MouseEvent): void {
    const bounds = (
      event.currentTarget as HTMLImageElement
    ).getBoundingClientRect();
    const x = Math.floor(
      (((event.clientX - bounds.left) / bounds.width) * this.viewportSize -
        this.offset) /
        this.cellSize,
    );
    const y = Math.floor(
      (((event.clientY - bounds.top) / bounds.height) * this.viewportSize -
        this.offset) /
        this.cellSize,
    );
    this.selected =
      this.cells.find(
        (c) =>
          Math.round((c.x - this.offset) / this.pitch) === x &&
          Math.round((c.y - this.offset) / this.pitch) === y,
      ) ?? null;
    this.publishImage();
  }
  redrawImage(): void {
    // A detached canvas rasterizes the cells; only a PNG image enters the DOM.
    const resolution = Math.max(
      1,
      Math.round(this.viewportSize * (window.devicePixelRatio || 1)),
    );
    this.bitmap.width = this.bitmap.height = resolution;
    this.snapshot.width = this.snapshot.height = resolution;
    const context = this.bitmap.getContext('2d');
    if (!context) return;
    const scale = resolution / this.viewportSize;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.fillStyle = '#050509';
    context.fillRect(0, 0, this.viewportSize, this.viewportSize);
    for (const cell of this.cells) this.paintCell(cell);
    this.publishImage();
  }
  private paintCell(cell: Cell): void {
    const context = this.bitmap.getContext('2d');
    if (!context) return;
    const colors = {
      prime: '#75cfff',
      probable: '#ffb184',
      composite: '#272733',
      pending: '#696979',
      unit: '#ba8be0',
    };
    context.fillStyle = '#050509';
    let x = Math.floor(cell.x);
    let y = Math.floor(cell.y);
    context.fillRect(x, y, this.pitch, this.pitch);
    context.fillStyle = colors[cell.state];
    context.fillRect(x, y, this.pitch, this.pitch);
    if (this.labels && this.cellSize >= 28 && cell.n < 10000n) {
      context.font = '10px sans-serif';
      context.textAlign = 'center';
      context.lineWidth = 2;
      context.strokeStyle = '#111';
      context.fillStyle = '#fff';
      context.strokeText(
        cell.n.toString(),
        x + this.pitch / 2,
        y + this.pitch * 0.65,
      );
      context.fillText(
        cell.n.toString(),
        x + this.pitch / 2,
        y + this.pitch * 0.65,
      );
    }
  }
  private publishImage(): void {
    const context = this.snapshot.getContext('2d');
    if (!context) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.snapshot.width, this.snapshot.height);
    context.drawImage(this.bitmap, 0, 0);
    if (this.selected) {
      const scale = this.snapshot.width / this.viewportSize;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.strokeStyle = '#fff';
      context.lineWidth = 2;
      context.strokeRect(
        this.selected.x,
        this.selected.y,
        this.pitch,
        this.pitch,
      );
    }
    this.imageUrl = this.snapshot.toDataURL('image/png');
    this.lastSnapshot = performance.now();
  }
  label(state: Cell['state']): string {
    return {
      unit: '1: ni primo ni compuesto',
      composite: 'Compuesto',
      prime: 'Primo demostrado',
      probable: 'Primo probable (no demostrado)',
      pending: 'Pendiente de comprobar',
    }[state];
  }
}
