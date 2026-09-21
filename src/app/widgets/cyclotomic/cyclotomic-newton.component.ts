import { CommonModule } from '@angular/common';
import { OnInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cyclotomicNewton, primitiveRoots } from '../../shared/math/cyclotomic';

@Component({
  selector: 'app-cyclotomic-newton', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './cyclotomic-newton.component.html', styleUrl: './cyclotomic-widgets.css'
})
export class CyclotomicNewtonComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  n = 5; roots = primitiveRoots(5); max = 45; size = 360;
  centerRe = 0; centerIm = 0; span = 4; re = 0.3; im = 0.4;
  drawing = false; progress = 0; error = ''; showOrbit = true;
  selected = cyclotomicNewton(this.roots, this.re, this.im, this.max, true);
  private frame = 0; private ready = false;
  constructor(private zone: NgZone) {}
  ngOnInit() { this.ready = true; this.draw(); }
  update() { this.roots = primitiveRoots(this.n); this.select(); this.draw(); }
  select() {
    if (![this.re, this.im].every(Number.isFinite) || Math.abs(this.re) > 100 || Math.abs(this.im) > 100) { this.error = 'Elige partes real e imaginaria entre −100 y 100.'; return; }
    this.error = ''; this.selected = cyclotomicNewton(this.roots, this.re, this.im, this.max, true);
  }
  sx(re: number) { return 600 * ((re - this.centerRe) / this.span + 0.5); }
  sy(im: number) { return 600 * (0.5 - (im - this.centerIm) / this.span); }
  get path() { return this.selected.points.map((p, j) => `${j ? 'L' : 'M'}${this.sx(p.re)},${this.sy(p.im)}`).join(' '); }
  get status() { return this.selected.root >= 0 ? `Convergencia a la raíz k = ${this.roots[this.selected.root].k} en ${this.selected.steps} pasos.` : this.selected.reason === 'singular' ? 'Iteración singular: derivada nula o límite numérico.' : `Sin clasificar tras ${this.max} pasos; esto no demuestra divergencia.`; }
  get outside() { return this.selected.points.some(p => Math.abs(p.re - this.centerRe) > this.span / 2 || Math.abs(p.im - this.centerIm) > this.span / 2); }
  pick(event: MouseEvent) {
    const svg = event.currentTarget as SVGSVGElement, matrix = svg.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    this.re = this.centerRe + (p.x / 600 - 0.5) * this.span;
    this.im = this.centerIm + (0.5 - p.y / 600) * this.span; this.select();
  }
  zoom(factor: number) { this.centerRe = this.re; this.centerIm = this.im; this.span = Math.max(0.002, Math.min(8, this.span * factor)); this.draw(); }
  reset() { this.centerRe = 0; this.centerIm = 0; this.span = 4; this.draw(); }
  color(index: number) { return `hsl(${index * 360 / this.roots.length} 72% 65%)`; }
  private rgb(index: number): number[] {
    const h = index * 6 / this.roots.length, x = 1 - Math.abs(h % 2 - 1);
    const components = h < 1 ? [1,x,0] : h < 2 ? [x,1,0] : h < 3 ? [0,1,x] : h < 4 ? [0,x,1] : h < 5 ? [x,0,1] : [1,0,x];
    return components.map(c => 65 + c * 185);
  }
  stop() { cancelAnimationFrame(this.frame); this.drawing = false; }
  draw() {
    if (!this.ready) return;
    this.stop();
    const canvas = this.canvas.nativeElement; canvas.width = this.size; canvas.height = this.size;
    const ctx = canvas.getContext('2d');
    if (!ctx) { this.error = 'No se ha podido iniciar el lienzo 2D.'; return; }
    const size = this.size, roots = this.roots, max = this.max, span = this.span, cr = this.centerRe, ci = this.centerIm;
    const image = ctx.createImageData(size, size), palette = roots.map((_, i) => this.rgb(i));
    ctx.fillStyle = '#0a141c'; ctx.fillRect(0,0,size,size);
    this.drawing = true; this.progress = 0;
    let row = 0;
    this.zone.runOutsideAngular(() => {
      const chunk = () => {
        const start = performance.now(), first = row;
        do {
          for (let col = 0; col < size; col++) {
            const result = cyclotomicNewton(roots, cr + ((col + 0.5) / size - 0.5) * span, ci + (0.5 - (row + 0.5) / size) * span, max);
            const color = result.root < 0 ? [10,20,28] : palette[result.root];
            const light = result.root < 0 ? 1 : 0.25 + 0.75 * Math.exp(-result.steps / 22);
            const index = (row * size + col) * 4;
            for (let c = 0; c < 3; c++) image.data[index + c] = color[c] * light;
            image.data[index + 3] = 255;
          }
          row++;
        } while (row < size && performance.now() - start < 12);
        ctx.putImageData(image, 0, 0, 0, first, size, row - first);
        this.zone.run(() => { this.progress = Math.round(100 * row / size); this.drawing = row < size; });
        if (row < size) this.frame = requestAnimationFrame(chunk);
      };
      this.frame = requestAnimationFrame(chunk);
    });
  }
  download() { const link = document.createElement('a'); link.download = `newton-phi-${this.n}.png`; link.href = this.canvas.nativeElement.toDataURL('image/png'); link.click(); }
  ngOnDestroy() { this.stop(); }
}
