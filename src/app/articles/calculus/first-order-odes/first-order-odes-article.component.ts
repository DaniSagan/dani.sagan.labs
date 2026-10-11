import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve } from '../../shared/learning-math';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-first-order-odes-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './first-order-odes-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class FirstOrderOdesArticleComponent {
    static title = 'Ecuaciones diferenciales de primer orden y enfriamiento';
    static route = 'first-order-odes';
    initial = 90;
    ambient = 20;
    k = Math.log(70 / 40) / 10;
    h = 5;
    series: PlotSeries[] = [];
    finalEuler = 0;
    fineError = 0;
    get ymin(): number { return Math.min(this.initial, this.ambient) - 15; }
    get ymax(): number { return Math.max(this.initial, this.ambient) + 15; }
    exact(t: number): number { return this.ambient + (this.initial - this.ambient) * Math.exp(-this.k * t); }
    get halfLife(): number { return Math.log(2) / this.k; }
    get stability(): string { return this.k * this.h === 1 ? 'Equilibrio artificial en un paso' : this.k * this.h < 1 ? 'Monótono y estable' : this.k * this.h < 2 ? 'Oscilatorio; estable en magnitud' : this.k * this.h === 2 ? 'No amortigua el error' : 'Inestable'; }
    constructor() { this.update(); }
    preset(): void { this.initial = 90; this.ambient = 20; this.k = Math.log(70 / 40) / 10; this.update(); }
    private euler(step: number): [
        number,
        number
    ][] { let t = 0, y = this.initial; const points: [
        number,
        number
    ][] = [[t, y]]; while (t < 60 - 1e-10) {
        const dt = Math.min(step, 60 - t);
        y -= this.k * dt * (y - this.ambient);
        t += dt;
        points.push([t, y]);
    } return points; }
    update(): void {
        const e = this.euler(this.h);
        this.finalEuler = e[e.length - 1][1];
        const fine = this.euler(this.h / 2);
        this.fineError = Math.abs(fine[fine.length - 1][1] - this.exact(60));
        const field: [
            number,
            number
        ][] = [];
        for (let t = 0; t <= 60; t += 5)
            for (let y = this.ymin; y <= this.ymax; y += (this.ymax - this.ymin) / 8) {
                const slope = -this.k * (y - this.ambient), norm = Math.sqrt(1 + (slope * 60 / (this.ymax - this.ymin)) ** 2), dt = 1.8 / norm;
                field.push([t - dt, y - slope * dt], [t + dt, y + slope * dt], [NaN, NaN]);
            }
        this.series = [{ label: 'Campo de pendientes', points: field, color: '#74819a' }, curve('Solución exacta', t => this.exact(t), 0, 60), { label: 'Euler explícito', points: e, color: '#e8643a' }, curve('Equilibrio', () => this.ambient, 0, 60, '#a8e6a0', 2)];
    }
}
