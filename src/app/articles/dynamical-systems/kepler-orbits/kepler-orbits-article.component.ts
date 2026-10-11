import { Component, OnDestroy } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve } from '../../shared/learning-math';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-kepler-orbits-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './kepler-orbits-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class KeplerOrbitsArticleComponent implements OnDestroy {
    static title = 'Órbitas circulares y tercera ley de Kepler';
    static route = 'kepler-orbits';
    readonly Math = Math;
    readonly G = 6.67430e-11;
    readonly solarMass = 1.98847e30;
    readonly AU = 149597870700;
    mass = 1;
    radius = 1;
    eccentricity = 0;
    phase = 0;
    playing = false;
    series: PlotSeries[] = [];
    private timer?: ReturnType<typeof setInterval>;
    get mu(): number { return this.G * this.mass * this.solarMass; }
    get period(): number { return 2 * Math.PI * Math.sqrt((this.radius * this.AU) ** 3 / this.mu) / 86400; }
    get circularSpeed(): number { return Math.sqrt(this.mu / (this.radius * this.AU)) / 1000; }
    get scale(): number { return 220 / Math.max(1, this.radius); }
    get a(): number { return this.radius * this.scale; }
    get b(): number { return this.a * Math.sqrt(1 - this.eccentricity ** 2); }
    // x = a cos(E) and r = a(1 - e cos(E)) place the occupied focus at +ae.
    get focusX(): number { return 330 + this.a * this.eccentricity; }
    get E(): number { const M = this.phase * 2 * Math.PI; let e = M; for (let i = 0; i < 12; i++)
        e -= (e - this.eccentricity * Math.sin(e) - M) / (1 - this.eccentricity * Math.cos(e)); return e; }
    get position(): {
        x: number;
        y: number;
    } { return { x: 330 + this.a * Math.cos(this.E), y: 250 + this.b * Math.sin(this.E) }; }
    get distanceAU(): number { return this.radius * (1 - this.eccentricity * Math.cos(this.E)); }
    get speed(): number { return Math.sqrt(this.mu * (2 / (this.distanceAU * this.AU) - 1 / (this.radius * this.AU))) / 1000; }
    get equalTimePoints(): {
        x: number;
        y: number;
    }[] { return Array.from({ length: 16 }, (_, i) => { const M = i / 16 * 2 * Math.PI; let E = M; for (let j = 0; j < 12; j++)
        E -= (E - this.eccentricity * Math.sin(E) - M) / (1 - this.eccentricity * Math.cos(E)); return { x: 330 + this.a * Math.cos(E), y: 250 + this.b * Math.sin(E) }; }); }
    private readonly visibilityChanged = () => { if (document.hidden)
        this.pause(); };
    private readonly motion = matchMedia('(prefers-reduced-motion: reduce)');
    private readonly motionChanged = () => { if (this.motion.matches)
        this.pause(); };
    constructor() { this.update(); document.addEventListener('visibilitychange', this.visibilityChanged); this.motion.addEventListener('change', this.motionChanged); }
    update(): void { this.pause(); this.phase = 0; this.series = [curve('T(a), para la masa elegida', r => 2 * Math.PI * Math.sqrt((r * this.AU) ** 3 / this.mu) / 86400, .2, 5)]; }
    step(): void { this.pause(); this.phase = (this.phase + 1 / 16) % 1; }
    toggle(): void { if (this.playing) {
        this.pause();
        return;
    } if (this.motion.matches) {
        this.step();
        return;
    } this.playing = true; this.timer = setInterval(() => this.phase = (this.phase + .004) % 1, 40); }
    pause(): void { if (this.timer)
        clearInterval(this.timer); this.timer = undefined; this.playing = false; }
    ngOnDestroy(): void { this.pause(); document.removeEventListener('visibilitychange', this.visibilityChanged); this.motion.removeEventListener('change', this.motionChanged); }
}
