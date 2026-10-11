import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { hypergeometric, binomial } from '../../shared/learning-math';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-hypergeometric-distribution-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './hypergeometric-distribution-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class HypergeometricDistributionArticleComponent {
    static title = 'Distribución hipergeométrica: extracción sin reemplazo';
    static route = 'hypergeometric-distribution';
    N = 8;
    K = 5;
    n = 3;
    selected = 2;
    probabilities: number[] = [];
    counts: number[] = [];
    trials = 0;
    last: number[] = [];
    series: PlotSeries[] = [];
    get mean(): number { return this.n * this.K / this.N; }
    get variance(): number { const p = this.K / this.N; return this.n * p * (1 - p) * (this.N - this.n) / (this.N - 1); }
    get empiricalMean(): number { return this.trials ? this.counts.reduce((s, c, k) => s + c * k, 0) / this.trials : 0; }
    get lower(): number { return Math.max(0, this.n - (this.N - this.K)); }
    get upper(): number { return Math.min(this.n, this.K); }
    constructor() { this.update(); }
    update(): void { this.K = Math.min(this.K, this.N); this.n = Math.min(this.n, this.N); this.selected = Math.min(this.selected, this.n); this.probabilities = hypergeometric(this.N, this.K, this.n); this.reset(); }
    reset(): void { this.counts = Array(this.n + 1).fill(0); this.trials = 0; this.last = []; this.plot(); }
    sample(): void {
        for (let run = 0; run < 200; run++) {
            let red = this.K, total = this.N, hits = 0;
            const balls: number[] = [];
            for (let j = 0; j < this.n; j++) {
                const hit = Math.random() < red / total;
                if (hit) {
                    red--;
                    hits++;
                }
                total--;
                balls.push(hit ? 1 : 0);
            }
            this.counts[hits]++;
            this.trials++;
            this.last = balls;
        }
        this.plot();
    }
    private plot(): void { const bi = binomial(this.n, this.K / this.N); this.series = [{ label: 'Hipergeométrica exacta', kind: 'bars', points: this.probabilities.map((p, k) => [k, p]) }, { label: 'Binomial con el mismo p', color: '#4a9eff', points: bi.map((p, k) => [k, p]) }]; if (this.trials)
        this.series.push({ label: 'Frecuencia simulada', color: '#a8e6a0', points: this.counts.map((c, k) => [k, c / this.trials]) }); }
}
