import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve } from '../../shared/learning-math';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-continuous-random-variables-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './continuous-random-variables-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ContinuousRandomVariablesArticleComponent {
    static title = 'Variables continuas: densidad, esperanza y varianza';
    static route = 'continuous-random-variables';
    L = 2;
    power = 1;
    lower = 0;
    upper = 1;
    series: PlotSeries[] = [];
    cdfSeries: PlotSeries[] = [];
    trials = 0;
    sum = 0;
    squares = 0;
    counts = Array(20).fill(0);
    get coefficient(): number { return (this.power + 1) / this.L ** (this.power + 1); }
    density(x: number): number { return x >= 0 && x <= this.L ? this.coefficient * x ** this.power : 0; }
    cdf(x: number): number { return x <= 0 ? 0 : x >= this.L ? 1 : (x / this.L) ** (this.power + 1); }
    get mean(): number { return this.L * (this.power + 1) / (this.power + 2); }
    get variance(): number { return this.L ** 2 * (this.power + 1) / ((this.power + 3) * (this.power + 2) ** 2); }
    get probability(): number { return this.cdf(this.upper) - this.cdf(this.lower); }
    get ymax(): number { return Math.max((this.power + 1) / this.L * 1.15, this.trials ? Math.max(...this.counts) / this.trials / (this.L / 20) * 1.15 : 0); }
    constructor() { this.update(); }
    update(): void { this.lower = Math.min(this.L, Math.max(0, this.lower)); this.upper = Math.min(this.L, Math.max(this.lower, this.upper)); this.reset(); }
    bounds(): void { this.upper = Math.max(this.lower, this.upper); this.plot(); }
    reset(): void { this.trials = 0; this.sum = 0; this.squares = 0; this.counts = Array(20).fill(0); this.plot(); }
    sample(): void { for (let i = 0; i < 1000; i++) {
        const x = this.L * Math.random() ** (1 / (this.power + 1));
        this.sum += x;
        this.squares += x * x;
        this.counts[Math.min(19, Math.floor(x / this.L * 20))]++;
        this.trials++;
    } this.plot(); }
    private plot(): void { this.series = [{ ...curve('Área del intervalo', x => this.density(x), this.lower, this.upper), kind: 'area' }, curve('Densidad normalizada', x => this.density(x), 0, this.L, '#4a9eff')]; if (this.trials)
        this.series.push({ label: 'Histograma: frecuencia / ancho', kind: 'bars', color: '#a8e6a0', points: this.counts.map((c, i) => [(i + .5) * this.L / 20, c / this.trials / (this.L / 20)]) }); this.cdfSeries = [curve('F(x)', x => this.cdf(x), -this.L * .15, this.L * 1.15, '#c5a1ea')]; }
}
