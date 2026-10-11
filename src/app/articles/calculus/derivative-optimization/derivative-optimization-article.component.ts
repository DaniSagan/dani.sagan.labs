import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve } from '../../shared/learning-math';
import { PlotSeries, PlotMarker } from '../../shared/learning-plot.component';
@Component({ selector: 'app-derivative-optimization-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './derivative-optimization-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class DerivativeOptimizationArticleComponent {
    static title = 'Optimización con derivadas';
    static route = 'derivative-optimization';
    mode = 0;
    parameter = 40;
    x = 10;
    series: PlotSeries[] = [];
    derivativeSeries: PlotSeries[] = [];
    markers: PlotMarker[] = [];
    get limit(): number { return this.mode < 2 ? this.parameter / 2 : Math.sqrt(this.parameter) + 1; }
    get optimum(): number { return this.mode === 0 ? this.parameter / 4 : this.mode === 1 ? this.parameter / 6 : Math.sqrt(Math.max(0, this.parameter - .5)); }
    get ymax(): number { return this.mode === 0 ? this.parameter ** 2 / 14 : this.mode === 1 ? this.parameter ** 3 / 12 : Math.max(this.value(0), this.value(this.limit)) * 1.1 + 1; }
    value(x: number): number { return this.mode === 0 ? x * (this.parameter / 2 - x) : this.mode === 1 ? x * (this.parameter - 2 * x) ** 2 : x * x + (x * x - this.parameter) ** 2; }
    derivative(x: number): number { return this.mode === 0 ? this.parameter / 2 - 2 * x : this.mode === 1 ? (this.parameter - 2 * x) * (this.parameter - 6 * x) : 2 * x * (1 + 2 * x * x - 2 * this.parameter); }
    get derivativeScale(): number { return Math.max(1, ...Array.from({ length: 51 }, (_, i) => Math.abs(this.derivative(this.limit * i / 50)))); }
    get fraction(): number { return this.mode === 1 ? this.x / this.parameter : 0; }
    constructor() { this.update(); }
    select(): void { this.parameter = this.mode === 0 ? 40 : this.mode === 1 ? 12 : 3; this.x = this.optimum; this.update(); }
    update(): void { this.x = Math.min(this.limit, Math.max(0, this.x)); this.series = [curve(this.mode === 2 ? 'Distancia al cuadrado' : 'Función objetivo', v => this.value(v), 0, this.limit)]; this.derivativeSeries = [curve('Derivada', v => this.derivative(v), 0, this.limit, '#4a9eff')]; this.markers = [{ x: this.optimum, y: this.value(this.optimum), label: 'Óptimo global', color: '#a8e6a0' }, { x: this.x, y: this.value(this.x), label: 'Elección actual' }]; }
}
