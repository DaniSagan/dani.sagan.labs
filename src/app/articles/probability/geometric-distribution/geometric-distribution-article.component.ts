import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-geometric-distribution-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './geometric-distribution-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class GeometricDistributionArticleComponent {
    static title = 'Distribución geométrica y tiempo de espera';
    static route = 'geometric-distribution';
    p = .25;
    threshold = 3;
    elapsed = 3;
    extra = 4;
    trials = 0;
    total = 0;
    counts = Array(21).fill(0);
    series: PlotSeries[] = [];
    survival: PlotSeries[] = [];
    get mean(): number { return 1 / this.p; }
    get variance(): number { return (1 - this.p) / this.p ** 2; }
    get tail(): number { return (1 - this.p) ** this.threshold; }
    get memory(): number { return (1 - this.p) ** this.extra; }
    constructor() { this.update(); }
    update(): void { this.reset(); }
    reset(): void { this.trials = 0; this.total = 0; this.counts = Array(21).fill(0); this.plot(); }
    sample(): void { for (let i = 0; i < 500; i++) {
        const u = Math.max(Number.MIN_VALUE, Math.random());
        const x = this.p === 1 ? 1 : Math.floor(Math.log(u) / Math.log1p(-this.p)) + 1;
        this.counts[Math.min(x, 21) - 1]++;
        this.total += x;
        this.trials++;
    } this.plot(); }
    private plot(): void { const points: [
        number,
        number
    ][] = Array.from({ length: 20 }, (_, i) => [i + 1, this.p * (1 - this.p) ** i]); points.push([21, (1 - this.p) ** 20]); this.series = [{ label: 'Ley exacta (21 = cola > 20)', kind: 'bars', points }]; if (this.trials)
        this.series.push({ label: 'Frecuencias observadas', color: '#a8e6a0', points: this.counts.map((c, i) => [i + 1, c / this.trials]) }); this.survival = [{ label: 'P(X > k)', color: '#4a9eff', points: Array.from({ length: 31 }, (_, k) => [k, (1 - this.p) ** k]) }]; }
}
