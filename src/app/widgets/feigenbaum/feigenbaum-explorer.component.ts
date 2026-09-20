import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { iterateMap, lyapunov, orbit } from '../../shared/math/feigenbaum';

@Component({
  selector: 'app-feigenbaum-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './feigenbaum-explorer.component.html', styleUrl: './feigenbaum-widgets.css'
})
export class FeigenbaumExplorerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('diagram', { static: true }) diagram!: ElementRef<HTMLCanvasElement>;
  r = 3.5;
  seed = 0.231;
  steps = 40;
  epsilonPower = -7;
  zoom = 0;
  lambda = 0;
  cobweb = '';
  curve = '';
  first = '';
  second = '';
  separation = '';
  finalSeparation = 0;
  readonly views = [
    { label: 'Panorámica', min: 2.8, max: 4 },
    { label: 'Cascada', min: 3.4, max: 3.6 },
    { label: 'Acumulación', min: 3.56, max: 3.572 },
    { label: 'Ventana de período 3', min: 3.82, max: 3.86 }
  ];
  readonly presets = [{ label: 'Punto fijo', r: 2.8 }, { label: 'Período 2', r: 3.2 },
    { label: 'Período 4', r: 3.5 }, { label: 'Período 8', r: 3.55 },
    { label: 'Umbral', r: 3.569945672 }, { label: 'Caos', r: 3.9 }, { label: 'Período 3', r: 3.83 }];
  private observer?: ResizeObserver;
  private frame = 0;
  private diagramFrame = 0;
  private animation = 0;
  playing = false;
  constructor(private zone: NgZone) { this.update(); }
  get view() { return this.views[this.zoom]; }
  get marker(): number { return 50 + 730 * (this.r - this.view.min) / (this.view.max - this.view.min); }
  get lambdaLabel(): string { return Number.isFinite(this.lambda) ? this.lambda.toFixed(5) : '−∞'; }
  get regime(): string { return Math.abs(this.lambda) < 0.005 ? 'Próximo a la neutralidad' : this.lambda > 0 ? 'Separación exponencial media' : 'Contracción media'; }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => this.draw());
      this.observer.observe(this.diagram.nativeElement);
      this.draw();
    });
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this.diagramFrame);
    cancelAnimationFrame(this.animation);
  }
  select(r: number): void {
    this.r = r;
    if (r < this.view.min || r > this.view.max) { this.zoom = 0; this.draw(); }
    this.update();
  }
  changeView(value: number): void {
    this.zoom = Number(value);
    this.r = Math.max(this.view.min, Math.min(this.view.max, this.r));
    this.update();
    this.draw();
  }
  schedule(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update());
  }
  selectFromPlot(event: PointerEvent): void {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, ((event.clientX - rect.left) / rect.width * 800 - 50) / 730));
    this.r = this.view.min + ratio * (this.view.max - this.view.min);
    this.update();
  }
  toggle(): void {
    this.playing = !this.playing;
    cancelAnimationFrame(this.animation);
    if (!this.playing) return;
    if (this.steps >= 120) this.steps = 1;
    let last = 0;
    const tick = (time: number) => {
      if (time - last > 110) {
        this.steps++;
        this.update();
        last = time;
      }
      if (this.steps < 120) this.animation = requestAnimationFrame(tick);
      else this.playing = false;
    };
    this.animation = requestAnimationFrame(tick);
  }
  update(): void {
    const a = orbit('logistic', this.r, this.seed, this.steps);
    const b = orbit('logistic', this.r, this.seed + 10 ** this.epsilonPower, this.steps);
    this.lambda = lyapunov('logistic', this.r, this.seed);
    this.curve = Array.from({ length: 151 }, (_, i) => `${i ? 'L' : 'M'}${35 + 330 * i / 150},${365 - 330 * iterateMap('logistic', this.r, i / 150)}`).join(' ');
    this.cobweb = `M${35 + 330 * a[0]},365 ` + a.slice(1).map((x, i) => `L${35 + 330 * a[i]},${365 - 330 * x} L${35 + 330 * x},${365 - 330 * x}`).join(' ');
    const path = (values: number[], log = false) => values.map((v, i) => {
      const y = log ? 180 - (Math.log10(Math.max(1e-16, v)) + 16) / 16 * 155 : 180 - v * 155;
      return `${i ? 'L' : 'M'}${45 + i / this.steps * 715},${y}`;
    }).join(' ');
    this.first = path(a);
    this.second = path(b);
    this.separation = path(a.map((x, i) => Math.abs(x - b[i])), true);
    this.finalSeparation = Math.abs(a[this.steps] - b[this.steps]);
  }
  private draw(): void {
    cancelAnimationFrame(this.diagramFrame);
    const canvas = this.diagram.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(300, canvas.clientWidth);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(width * 0.45 * dpr);
    ctx.setTransform(canvas.width / 800, 0, 0, canvas.height / 360, 0, 0);
    ctx.clearRect(0, 0, 800, 360);
    ctx.fillStyle = '#82e3cc';
    const { min, max } = this.view;
    let column = 0;
    const columns = Math.min(1500, Math.round(width * dpr));
    const render = () => {
      const end = Math.min(columns, column + 45);
      for (; column < end; column++) {
        const r = min + column / (columns - 1) * (max - min);
        const points = orbit('logistic', r, 0.413, 140, 1600);
        for (const x of points) ctx.fillRect(50 + column / (columns - 1) * 730, 320 - x * 300, 0.85, 0.8);
      }
      if (column < columns) this.diagramFrame = requestAnimationFrame(render);
    };
    this.zone.runOutsideAngular(() => { this.diagramFrame = requestAnimationFrame(render); });
  }
}
