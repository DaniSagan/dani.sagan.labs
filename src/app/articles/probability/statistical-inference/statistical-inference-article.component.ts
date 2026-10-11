import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve, gaussian, normalCdf, normalQuantile } from '../../shared/learning-math';
import { PlotSeries, PlotMarker } from '../../shared/learning-plot.component';
@Component({ selector: 'app-statistical-inference-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './statistical-inference-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class StatisticalInferenceArticleComponent {
    static title = 'Inferencia estadística: intervalos, contrastes y tamaño muestral';
    static route = 'statistical-inference';
    n = 100;
    sigma = 10;
    mean = 52;
    nullMean = 50;
    confidence = .95;
    trueMean = 50;
    margin = .05;
    planningP = .5;
    unknownP = true;
    intervals: {
        lo: number;
        hi: number;
        covers: boolean;
        left: number;
        width: number;
    }[] = [];
    trials = 0;
    covered = 0;
    series: PlotSeries[] = [];
    markers: PlotMarker[] = [];
    get se(): number { return this.sigma / Math.sqrt(this.n); }
    get critical(): number { return normalQuantile((1 + this.confidence) / 2); }
    get halfWidth(): number { return this.critical * this.se; }
    get statistic(): number { return (this.mean - this.nullMean) / this.se; }
    get pValue(): number { return Math.min(1, 2 * normalCdf(-Math.abs(this.statistic))); }
    get rejects(): boolean { return Math.abs(this.statistic) > this.critical; }
    get requiredN(): number { const p = this.unknownP ? .5 : this.planningP; return Math.ceil(this.critical ** 2 * p * (1 - p) / this.margin ** 2); }
    get plotLimit(): number { return Math.max(4, Math.abs(this.statistic) + 1); }
    constructor() { this.update(); }
    update(): void { this.resetCoverage(); this.plot(); }
    plot(): void { const l = this.plotLimit, phi = (z: number) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); this.series = [curve('Normal estándar bajo H₀', phi, -l, l), { ...curve('Región crítica izquierda', phi, -l, -this.critical, '#e8643a'), kind: 'area' }, { ...curve('Región crítica derecha', phi, this.critical, l, '#e8643a'), kind: 'area' }]; this.markers = [{ x: this.statistic, y: 0, label: 'Estadístico observado', color: '#4a9eff' }]; }
    resetCoverage(): void { this.intervals = []; this.trials = 0; this.covered = 0; }
    simulate(): void { for (let i = 0; i < 100; i++) {
        const m = this.trueMean + this.se * gaussian(), lo = m - this.halfWidth, hi = m + this.halfWidth, covers = lo <= this.trueMean && hi >= this.trueMean;
        this.trials++;
        if (covers)
            this.covered++;
        const left = Math.max(0, Math.min(100, 50 + (lo - this.trueMean) / this.se * 100 / 12)), right = Math.max(0, Math.min(100, 50 + (hi - this.trueMean) / this.se * 100 / 12));
        this.intervals.push({ lo, hi, covers, left, width: right - left });
    } this.intervals = this.intervals.slice(-60); }
}
