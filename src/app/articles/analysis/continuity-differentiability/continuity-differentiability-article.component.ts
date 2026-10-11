import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve } from '../../shared/learning-math';
import { PlotSeries, PlotMarker } from '../../shared/learning-plot.component';
@Component({ selector: 'app-continuity-differentiability-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './continuity-differentiability-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ContinuityDifferentiabilityArticleComponent {
    static title = 'Continuidad y derivabilidad: funciones a trozos';
    static route = 'continuity-differentiability';
    mode = 0;
    a = 2;
    b = -1;
    exponent = 1;
    zoom = 1;
    series: PlotSeries[] = [];
    markers: PlotMarker[] = [];
    get center(): number { return this.mode === 0 ? 1 : 0; }
    get h(): number { return 10 ** (-this.exponent); }
    get leftSlope(): number { return (this.f(this.center - this.h) - this.f(this.center)) / (-this.h); }
    get rightSlope(): number { return (this.f(this.center + this.h) - this.f(this.center)) / this.h; }
    get status(): string { return this.mode === 0 ? (this.a + this.b !== 1 ? 'Discontinua: a + b ≠ 1' : this.a === 2 ? 'Continua y derivable' : 'Continua, no derivable') : this.mode === 1 ? 'Continua, no derivable' : this.mode === 2 ? 'Continua, no derivable' : 'Derivable; su derivada no es continua en 0'; }
    f(x: number): number { if (this.mode === 0)
        return x <= 1 ? this.a * x + this.b : x * x; if (this.mode === 1)
        return Math.abs(x); if (x === 0)
        return 0; return (this.mode === 2 ? x : x * x) * Math.sin(1 / x); }
    constructor() { this.update(); }
    select(): void { this.zoom = 1; this.update(); }
    update(): void {
        const c = this.center, lo = c - this.zoom, hi = c + this.zoom, gap = Math.min(.00001, this.zoom / 10000);
        this.series = [curve('Rama izquierda', x => this.f(x), lo, c, undefined, 501), curve('Rama derecha', x => this.f(x), c + gap, hi, '#4a9eff', 501)];
        this.series.push(curve('Secante izquierda', x => this.f(c) + this.leftSlope * (x - c), lo, hi, '#a8e6a0', 2), curve('Secante derecha', x => this.f(c) + this.rightSlope * (x - c), lo, hi, '#c5a1ea', 2));
        this.markers = [{ x: c, y: this.f(c), label: 'Valor de la función' }];
        if (this.mode === 0)
            this.markers.push({ x: 1, y: 1, label: 'Límite por la derecha', open: true, color: '#4a9eff' });
    }
}
