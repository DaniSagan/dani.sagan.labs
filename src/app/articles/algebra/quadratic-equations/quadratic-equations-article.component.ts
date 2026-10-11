import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve, quadraticRoots } from '../../shared/learning-math';
import { PlotMarker, PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-quadratic-equations-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './quadratic-equations-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class QuadraticEquationsArticleComponent {
    static title = 'Ecuaciones cuadráticas: discriminante y Viète';
    static route = 'quadratic-equations';
    a = 1;
    b = -4;
    c = 3;
    parameter = 4;
    result = quadraticRoots(this.a, this.b, this.c);
    series: PlotSeries[] = [];
    markers: PlotMarker[] = [];
    familySeries: PlotSeries[] = [];
    constructor() { this.update(); this.updateFamily(); }
    update(): void {
        this.result = quadraticRoots(this.a, this.b, this.c);
        this.series = [curve('ax² + bx + c', x => this.a * x * x + this.b * x + this.c, -6, 6)];
        this.markers = this.result.real.map(x => ({ x, y: 0, label: 'Raíz real' }));
        if (this.a)
            this.markers.push({ x: -this.b / (2 * this.a), y: -this.result.discriminant / (4 * this.a), label: 'Vértice', color: '#4a9eff' });
    }
    updateFamily(): void { this.familySeries = [curve('x² − 2αx + α + 2', x => x * x - 2 * this.parameter * x + this.parameter + 2, -4, 10)]; }
    get rootsText(): string { return this.result.real.map(x => x.toPrecision(5)).join(', ') || 'Ninguna raíz real aislada'; }
}
