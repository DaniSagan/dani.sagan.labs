import { CommonModule } from '@angular/common';
import { OnInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CyclotomicPoint, refineCyclotomicRoots } from '../../shared/math/cyclotomic';

@Component({
  selector: 'app-cyclotomic-fractal', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './cyclotomic-fractal.component.html', styleUrl: './cyclotomic-widgets.css'
})
export class CyclotomicFractalComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  depth = 14; pattern = 'rotate';
  centerRe = 0; centerIm = 0; span = 6;
  points: CyclotomicPoint[] = []; visible = 0;
  error = ''; selected: CyclotomicPoint | null = null;
  private ready = false;
  private frame = 0;
  ngOnInit() { this.ready = true; this.generate(); }
  generate() {
    let points: CyclotomicPoint[] = [{ re: -1, im: 0 }];
    for (let j = 0; j < this.depth; j++) points = refineCyclotomicRoots(points, this.pattern === 'rotate' || (this.pattern === 'alternating' && j % 2 === 0));
    this.points = points; this.selected = null; this.draw();
  }
  view() {
    if (![this.centerRe, this.centerIm, this.span].every(Number.isFinite) || this.span < 0.002 || this.span > 1000 || Math.abs(this.centerRe) > 1000 || Math.abs(this.centerIm) > 1000) {
      this.error = 'Usa un centro entre −1000 y 1000 y un ancho entre 0,002 y 1000.'; return;
    }
    this.error = ''; this.draw();
  }
  preset(pattern: string) { this.pattern = pattern; this.reset(); this.generate(); }
  reset() { this.centerRe = 0; this.centerIm = 0; this.span = this.pattern === 'classic' ? 3 : 6; this.error = ''; this.draw(); }
  zoom(factor: number) { this.span = Math.max(0.002, Math.min(1000, this.span * factor)); this.view(); }
  pan(x: number, y: number) { this.centerRe += x * this.span / 4; this.centerIm += y * this.span / 4; this.view(); }
  select(event: MouseEvent) {
    const bounds = this.canvas.nativeElement.getBoundingClientRect();
    const re = this.centerRe + ((event.clientX - bounds.left) / bounds.width - 0.5) * this.span;
    const im = this.centerIm + (0.5 - (event.clientY - bounds.top) / bounds.height) * this.span;
    this.selected = this.points.reduce((best, p) => Math.hypot(p.re - re, p.im - im) < Math.hypot(best.re - re, best.im - im) ? p : best, this.points[0]);
    this.centerRe = re; this.centerIm = im; this.view();
  }
  get description() { return this.pattern === 'classic' ? 'F en cada nivel' : this.pattern === 'rotate' ? 'F → R en cada nivel' : 'F → R, después F, alternadamente'; }
  get classicalIndex() { return 2 ** (this.depth + 1); }
  fmt(n: number) { return n.toLocaleString('es-ES', { maximumFractionDigits: 6 }); }
  draw() {
    if (!this.ready || this.error) return;
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const canvas = this.canvas.nativeElement, context = canvas.getContext('2d');
      if (!context) { this.error = 'No se ha podido iniciar el lienzo 2D.'; return; }
      const size = canvas.width, counts = new Uint16Array(size * size);
      this.visible = 0;
      for (const point of this.points) {
        const x = Math.floor(((point.re - this.centerRe) / this.span + 0.5) * size);
        const y = Math.floor((0.5 - (point.im - this.centerIm) / this.span) * size);
        if (x >= 0 && x < size && y >= 0 && y < size) { counts[y * size + x]++; this.visible++; }
      }
      const image = context.createImageData(size, size);
      for (let j = 0; j < counts.length; j++) {
        const intensity = counts[j] ? Math.min(1, 0.5 + Math.log2(counts[j] + 1) / 6) : 0;
        image.data[j * 4] = 10 + intensity * 120;
        image.data[j * 4 + 1] = 20 + intensity * 207;
        image.data[j * 4 + 2] = 28 + intensity * 176;
        image.data[j * 4 + 3] = 255;
      }
      context.putImageData(image, 0, 0);
      context.strokeStyle = '#56778380'; context.lineWidth = 1;
      const x = size * (0.5 - this.centerRe / this.span), y = size * (0.5 + this.centerIm / this.span);
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, size); context.moveTo(0, y); context.lineTo(size, y); context.stroke();
      context.setLineDash([3, 5]); context.beginPath(); context.arc(x, y, size / this.span, 0, 2 * Math.PI); context.stroke(); context.setLineDash([]);
      context.font = '12px monospace'; context.fillStyle = '#deeaef';
      context.fillText(`Nivel ${this.depth} | ${this.description}`, 12, 20);
      context.fillText(`Centro (${this.fmt(this.centerRe)}, ${this.fmt(this.centerIm)}) | ancho ${this.fmt(this.span)}`, 12, size - 12);
    });
  }
  download() { const link = document.createElement('a'); link.download = `ciclotomicos-${this.pattern}-${this.depth}.png`; link.href = this.canvas.nativeElement.toDataURL('image/png'); link.click(); }
  ngOnDestroy() { cancelAnimationFrame(this.frame); }
}
