import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { LearningPlotComponent, PlotMarker, PlotSeries } from '../../shared/learning-plot.component';
import { evaluateTrig, TRIG_FAMILIES, TRIG_FUNCTIONS, TrigEntry, TrigFamily, trigPlot } from './trigonometric-atlas.model';

@Component({
  selector: 'app-trigonometric-atlas', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent, LearningPlotComponent],
  templateUrl: './trigonometric-atlas.component.html',
  styleUrls: ['../../shared/learning-article.css', './trigonometric-atlas.component.css'],
})
export class TrigonometricAtlasComponent {
  static readonly title = 'Atlas de funciones trigonométricas: clásicas, históricas e hiperbólicas';
  static readonly route = 'trigonometric-functions-atlas';
  readonly families = TRIG_FAMILIES;
  readonly functions = TRIG_FUNCTIONS;
  readonly math = {
    circle: String.raw`\cos^2 x+\sin^2 x=1,\quad \tan x=\frac{\sin x}{\cos x},\quad 1+\tan^2 x=\sec^2 x`,
    half: String.raw`\operatorname{vers}x=1-\cos x=2\sin^2\!\frac{x}{2},\qquad\operatorname{hav}x=\frac{1-\cos x}{2}=\sin^2\!\frac{x}{2}`,
    cofunctions: String.raw`\operatorname{covers}x=\operatorname{vers}\!\left(\frac{\pi}{2}-x\right),\quad\operatorname{hacovers}x=\operatorname{hav}\!\left(\frac{\pi}{2}-x\right)`,
    hyperbolic: String.raw`\sinh x=\frac{e^x-e^{-x}}{2},\quad\cosh x=\frac{e^x+e^{-x}}{2},\quad\cosh^2 x-\sinh^2 x=1`,
    addition: String.raw`\sin(a+b)=\sin a\cos b+\cos a\sin b,\qquad\sinh(a+b)=\sinh a\cosh b+\cosh a\sinh b`,
    cosAddition: String.raw`\cos(a+b)=\cos a\cos b-\sin a\sin b,\qquad\cosh(a+b)=\cosh a\cosh b+\sinh a\sinh b`,
    asinh: String.raw`y=\sinh x\iff 2y=e^x-e^{-x}\iff u^2-2yu-1=0,\quad u=e^x>0`,
    gudermann: String.raw`\operatorname{gd}x=2\arctan\!\left(\tanh\frac{x}{2}\right),\quad\sin(\operatorname{gd}x)=\tanh x,\quad\tan(\operatorname{gd}x)=\sinh x`,
    complex: String.raw`e^{ix}=\cos x+i\sin x,\quad\sin(ix)=i\sinh x,\quad\cos(ix)=\cosh x`,
    haversine: String.raw`\operatorname{hav}\delta=\operatorname{hav}(\varphi_2-\varphi_1)+\cos\varphi_1\cos\varphi_2\operatorname{hav}(\lambda_2-\lambda_1),\quad d=R\delta`,
    chord: String.raw`c=2R\sin\frac{\theta}{2},\qquad s=R\!\left(1-\cos\frac{\theta}{2}\right)=R\operatorname{vers}\frac{\theta}{2}`,
    generalized: String.raw`\operatorname{arcsin}_p u=\int_0^u\frac{dt}{(1-t^p)^{1/p}},\quad 0\leq u\leq1,\quad p>1`,
  };
  readonly sections = TRIG_FAMILIES.map(family => ({ ...family, entries: TRIG_FUNCTIONS.filter(f => f.family === family.id) }));
  family: TrigFamily = 'historical';
  selectedId = 'hav';
  compareId = 'vers';
  unit: 'rad' | 'deg' = 'deg';
  value: number | null = 60;
  ySpan = 4;
  series: PlotSeries[] = [];
  markers: PlotMarker[] = [];
  constructor() { this.rebuild(); }
  get selected(): TrigEntry { return this.functions.find(f => f.id === this.selectedId)!; }
  get choices(): readonly TrigEntry[] { return this.functions.filter(f => f.family === this.family); }
  get rawArgument(): number { return this.value === null ? NaN : this.value * (this.selected.input === 'angle' && this.unit === 'deg' ? Math.PI / 180 : 1); }
  get evaluation(): ReturnType<typeof evaluateTrig> { return evaluateTrig(this.selected, this.rawArgument); }
  get displayResult(): string {
    const r = this.evaluation;
    if (r.status === 'domain') return 'Entrada fuera del dominio real';
    if (r.status === 'overflow') return 'Resultado fuera de la precisión numérica';
    const value = r.value! * (this.selected.output === 'angle' && this.unit === 'deg' ? 180 / Math.PI : 1);
    return this.format(value) + (this.selected.output === 'angle' ? this.unit === 'deg' ? '°' : ' rad' : '');
  }
  get sliderMin(): number { return this.selected.window[0] * (this.selected.input === 'angle' && this.unit === 'deg' ? 180 / Math.PI : 1); }
  get sliderMax(): number { return this.selected.window[1] * (this.selected.input === 'angle' && this.unit === 'deg' ? 180 / Math.PI : 1); }
  get naiveHaversine(): string { return this.format((1 - Math.cos(this.rawArgument)) / 2); }
  format(value: number): string {
    if (!Number.isFinite(value)) return 'No representable';
    if (value !== 0 && (Math.abs(value) < 1e-6 || Math.abs(value) >= 1e9)) return value.toExponential(8);
    return value.toLocaleString('es-ES', { maximumFractionDigits: 9 });
  }
  setFamily(family: TrigFamily): void { this.select(this.functions.find(f => f.family === family)!.id); }
  select(id: string, scroll = false): void {
    const entry = this.functions.find(f => f.id === id);
    if (!entry) return;
    this.selectedId = id; this.family = entry.family; this.compareId = '';
    this.example(); this.rebuild();
    if (scroll) document.getElementById('atlas-lab')?.scrollIntoView({ block: 'start' });
  }
  example(): void {
    this.value = this.selected.sample * (this.selected.input === 'angle' && this.unit === 'deg' ? 180 / Math.PI : 1);
    this.updateMarker();
  }
  setUnit(unit: 'rad' | 'deg'): void {
    if (unit !== this.unit && this.selected.input === 'angle' && this.value !== null) this.value *= unit === 'deg' ? 180 / Math.PI : Math.PI / 180;
    this.unit = unit; this.updateMarker();
  }
  tinyExample(): void { this.setUnit('rad'); this.select('hav'); this.value = 1e-8; this.updateMarker(); }
  rebuild(): void {
    this.series = [{ label: this.selected.name, points: trigPlot(this.selected), color: 'var(--accent)' }];
    const compare = this.functions.find(f => f.id === this.compareId);
    if (compare && compare.id !== this.selectedId) this.series.push({ label: compare.name, points: trigPlot(compare, this.selected.window), color: 'var(--gold)' });
    this.updateMarker();
  }
  updateMarker(): void {
    const r = this.evaluation;
    this.markers = r.value === null ? [] : [{ x: this.rawArgument, y: r.value, label: this.selected.name, color: 'var(--accent)' }];
  }
}
