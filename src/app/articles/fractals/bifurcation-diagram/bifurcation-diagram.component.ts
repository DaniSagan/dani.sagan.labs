import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Viewport { rMin: number; rMax: number; yMin: number; yMax: number; }
interface Preset extends Viewport { label: string; r: number; }

@Component({
  selector: 'app-bifurcation-diagram',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bifurcation-diagram.component.html',
  styleUrl: './bifurcation-diagram.component.css'
})
export class BifurcationDiagramComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('plot', { static: true }) plotRef!: ElementRef<HTMLElement>;
  static title = 'Aplicación logística';
  static route = 'bifurcation-diagram';

  readonly presets: Preset[] = [
    { label: 'Panorámica', rMin: 2.5, rMax: 4, yMin: 0, yMax: 1, r: 3.7 },
    { label: 'Equilibrio', rMin: 0, rMax: 3, yMin: 0, yMax: 1, r: 2.8 },
    { label: 'Duplicación de período', rMin: 2.9, rMax: 3.6, yMin: 0.25, yMax: 0.95, r: 3.5 },
    { label: 'Ventana de período 3', rMin: 3.82, rMax: 3.86, yMin: 0, yMax: 1, r: 3.83 },
  ];
  rMin = 2.5;
  rMax = 4;
  yMin = 0;
  yMax = 1;
  iterations = 1000;
  seed = 0.501;
  selectedR = 3.7;
  activePreset = 'Panorámica';
  draft = { rMin: 2.5, rMax: 4, yMin: 0, yMax: 1, iterations: 1000 };
  error = '';
  width = 800;
  height = 440;
  rendering = false;
  orbitPoints = '';
  lastValue = 0;
  private frame = 0;
  private observer?: ResizeObserver;
  private readonly left = 64;
  private readonly top = 22;
  private readonly right = 20;
  private readonly bottom = 42;

  constructor(private zone: NgZone) { this.updateOrbit(); }

  get markerX(): number {
    return this.left + (this.selectedR - this.rMin) / (this.rMax - this.rMin) * (this.width - this.left - this.right);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => {
        this.zone.run(() => this.resize());
      });
      this.observer.observe(this.plotRef.nativeElement);
      // Defer bound state changes until the initial view check has completed.
      this.frame = requestAnimationFrame(() => this.zone.run(() => this.resize()));
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
  }

  private resize(): void {
    this.width = Math.max(260, Math.round(this.plotRef.nativeElement.clientWidth));
    this.height = Math.round(Math.max(290, Math.min(480, this.width * 0.52)));
    this.render();
  }

  applyPreset(preset: Preset): void {
    this.setView(preset);
    this.activePreset = preset.label;
    this.selectR(preset.r);
  }

  resetView(): void { this.applyPreset(this.presets[0]); }

  applySettings(): void {
    const d = this.draft;
    if (!Object.values(d).every(v => typeof v === 'number' && Number.isFinite(v)) ||
        d.rMin < 0 || d.rMax > 4 || d.rMax - d.rMin < 0.00001 ||
        d.yMin < 0 || d.yMax > 1 || d.yMax - d.yMin < 0.00001 ||
        !Number.isInteger(d.iterations) || d.iterations < 200 || d.iterations > 5000) {
      this.error = 'Usa 0 ≤ r mínimo < r máximo ≤ 4 y 0 ≤ x mínimo < x máximo ≤ 1, con un intervalo de al menos 0,00001. Las iteraciones deben ser un entero entre 200 y 5000.';
      return;
    }
    this.iterations = d.iterations;
    this.setView(d);
  }

  zoom(factor: number): void {
    const rSpan = Math.min(4, Math.max(0.00001, (this.rMax - this.rMin) * factor));
    const ySpan = Math.min(1, Math.max(0.00001, (this.yMax - this.yMin) * factor));
    const rMin = Math.max(0, Math.min(4 - rSpan, this.selectedR - rSpan / 2));
    const yMin = Math.max(0, Math.min(1 - ySpan, (this.yMin + this.yMax - ySpan) / 2));
    this.setView({ rMin, rMax: rMin + rSpan, yMin, yMax: yMin + ySpan });
  }

  private setView(view: Viewport): void {
    this.rMin = view.rMin;
    this.rMax = view.rMax;
    this.yMin = view.yMin;
    this.yMax = view.yMax;
    this.draft = { rMin: this.rMin, rMax: this.rMax, yMin: this.yMin, yMax: this.yMax, iterations: this.iterations };
    this.error = '';
    this.activePreset = '';
    this.selectR(this.selectedR);
    this.render();
  }

  selectFromPlot(event: PointerEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * this.width / rect.width;
    this.selectR(this.rMin + (x - this.left) / (this.width - this.left - this.right) * (this.rMax - this.rMin));
  }

  selectR(value: number): void {
    this.selectedR = Math.max(this.rMin, Math.min(this.rMax, Number(value)));
    this.updateOrbit();
  }

  changeSeed(value: number): void {
    this.seed = Number(value);
    this.updateOrbit();
    this.render();
  }

  private updateOrbit(): void {
    let x = this.seed;
    const points: string[] = [];
    for (let n = 0; n <= 80; n++) {
      points.push(`${32 + n / 80 * 474},${140 - x * 128}`);
      if (n < 80) x = this.selectedR * x * (1 - x);
    }
    this.orbitPoints = points.join(' ');
    this.lastValue = x;
  }

  private render(): void {
    cancelAnimationFrame(this.frame);
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(this.width * ratio);
    canvas.height = Math.round(this.height * ratio);
    canvas.style.height = `${this.height}px`;
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#0b111c';
    ctx.fillRect(0, 0, this.width, this.height);
    const w = this.width - this.left - this.right;
    const h = this.height - this.top - this.bottom;
    ctx.font = '11px system-ui, sans-serif';
    ctx.lineWidth = 1;
    const ticks = this.width < 480 ? 2 : 4;
    const rDigits = Math.min(6, Math.max(2, Math.ceil(-Math.log10(this.rMax - this.rMin)) + 1));
    const yDigits = Math.min(6, Math.max(2, Math.ceil(-Math.log10(this.yMax - this.yMin)) + 1));
    for (let tick = 0; tick <= ticks; tick++) {
      const f = tick / ticks;
      const px = this.left + f * w;
      const py = this.top + f * h;
      ctx.strokeStyle = '#202c3c';
      ctx.beginPath();
      ctx.moveTo(px, this.top); ctx.lineTo(px, this.top + h);
      ctx.moveTo(this.left, py); ctx.lineTo(this.left + w, py);
      ctx.stroke();
      ctx.fillStyle = '#a5b5c7';
      ctx.textAlign = 'center';
      ctx.fillText((this.rMin + f * (this.rMax - this.rMin)).toFixed(rDigits), px, this.height - 23);
      ctx.textAlign = 'right';
      ctx.fillText((this.yMax - f * (this.yMax - this.yMin)).toFixed(yDigits), this.left - 9, py + 4);
    }
    ctx.textAlign = 'left';
    ctx.fillText('Población x', this.left, 13);
    ctx.textAlign = 'center';
    ctx.fillText('Parámetro de crecimiento r', this.left + w / 2, this.height - 5);
    this.rendering = true;
    let column = 0;
    // Snapshot the parameters so a frame never mixes two different views.
    const { rMin, rMax, yMin, yMax, seed, iterations } = this;
    const columns = Math.ceil(w * ratio);
    const bins = new Uint16Array(Math.ceil(h * ratio) + 1);
    const drawChunk = () => {
      const deadline = performance.now() + 10;
      while (column < columns && performance.now() < deadline) {
        const r = rMin + column / (columns - 1) * (rMax - rMin);
        let x = seed;
        for (let n = 0; n < iterations; n++) x = r * x * (1 - x);
        bins.fill(0);
        for (let n = 0; n < 256; n++) {
          x = r * x * (1 - x);
          if (x >= yMin && x <= yMax) {
            const row = Math.min(bins.length - 1, Math.floor((yMax - x) / (yMax - yMin) * h * ratio));
            bins[row]++;
          }
        }
        for (let row = 0; row < bins.length; row++) {
          if (!bins[row]) continue;
          const intensity = Math.min(1, 0.25 + Math.log1p(bins[row]) / 5);
          ctx.fillStyle = `rgba(104,224,211,${intensity})`;
          ctx.fillRect(this.left + column / ratio, this.top + row / ratio, 1 / ratio, 1 / ratio);
        }
        column++;
      }
      if (column < columns) this.frame = requestAnimationFrame(drawChunk);
      else this.zone.run(() => { this.rendering = false; });
    };
    this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(drawChunk); });
  }
}
