import { quadraticRoots, dividePolynomial, evaluatePolynomial, hypergeometric, normalCdf, normalQuantile } from './learning-math';
import { QuadraticEquationsArticleComponent } from '../algebra/quadratic-equations/quadratic-equations-article.component';
import { PolynomialDivisionArticleComponent } from '../algebra/polynomial-division/polynomial-division-article.component';
import { ContinuityDifferentiabilityArticleComponent } from '../analysis/continuity-differentiability/continuity-differentiability-article.component';
import { DerivativeOptimizationArticleComponent } from '../calculus/derivative-optimization/derivative-optimization-article.component';
import { FirstOrderOdesArticleComponent } from '../calculus/first-order-odes/first-order-odes-article.component';
import { HypergeometricDistributionArticleComponent } from '../probability/hypergeometric-distribution/hypergeometric-distribution-article.component';
import { GeometricDistributionArticleComponent } from '../probability/geometric-distribution/geometric-distribution-article.component';
import { ContinuousRandomVariablesArticleComponent } from '../probability/continuous-random-variables/continuous-random-variables-article.component';
import { StatisticalInferenceArticleComponent } from '../probability/statistical-inference/statistical-inference-article.component';
import { KeplerOrbitsArticleComponent } from '../dynamical-systems/kepler-orbits/kepler-orbits-article.component';
import { ALGEBRA_ARTICLES } from '../algebra/algebra-articles';
import { ANALYSIS_ARTICLES } from '../analysis/analysis-articles';
import { CALCULUS_ARTICLES } from '../calculus/calculus-articles';
import { PROBABILITY_ARTICLES } from '../probability/probability-articles';
import { DYNAMICAL_SYSTEMS_ARTICLES } from '../dynamical-systems/dynamical-systems-articles';
import { ArticlesProviderServiceService } from '../../shared/content/articles-provider-service.service';
import { PROBLEMS } from '../../problems/problems.data';
describe('Ten learning article experiments', () => {
    it('handles quadratic, repeated, complex, linear and identity cases without division by zero', () => {
        expect(quadraticRoots(1, -4, 3).real).toEqual([1, 3]);
        expect(quadraticRoots(1, -4, 4).real).toEqual([2]);
        expect(quadraticRoots(1, 0, 1).real).toEqual([]);
        expect(quadraticRoots(0, 2, -6).real).toEqual([3]);
        expect(quadraticRoots(0, 0, 0).kind).toContain('Todo');
        const roots = quadraticRoots(1, 1e8, 1).real;
        expect(roots[1]).toBeCloseTo(-1e-8, 14);
        expect(roots[0] * roots[1]).toBeCloseTo(1, 12);
        const lab = new QuadraticEquationsArticleComponent();
        lab.parameter = 2;
        lab.updateFamily();
        expect(quadraticRoots(1, -2 * lab.parameter, lab.parameter + 2).real).toEqual([2]);
    });
    it('reconstructs dividend values for linear, quadratic and repeated-root divisors', () => {
        for (const p of [[2, -2, 0, 1], [1, 3, 0, 0, 1], [-6, 11, -6, 1]])
            for (const d of [[-1, 1], [-1, 0, 1], [1, -2, 1], [4, 2]]) {
                const { quotient, remainder } = dividePolynomial(p, d);
                expect(remainder.length).toBeLessThan(d.length);
                for (const x of [-3, -1, 0, 1, 2.5])
                    expect(evaluatePolynomial(d, x) * evaluatePolynomial(quotient, x) + evaluatePolynomial(remainder, x)).toBeCloseTo(evaluatePolynomial(p, x), 10);
            }
        expect(() => dividePolynomial([1], [0])).toThrow();
        const lab = new PolynomialDivisionArticleComponent();
        lab.choice = 1;
        lab.divisorChoice = 1;
        lab.update();
        expect(lab.result.remainder).toEqual([2, 3]);
    });
    it('distinguishes matching heights from matching derivatives', () => {
        const lab = new ContinuityDifferentiabilityArticleComponent();
        expect(lab.status).toContain('derivable');
        expect(lab.leftSlope).toBeCloseTo(2, 10);
        expect(lab.rightSlope).toBeCloseTo(2 + lab.h, 10);
        lab.a = 1;
        lab.b = 0;
        expect(lab.status).toBe('Continua, no derivable');
        lab.a = 2;
        lab.b = 0;
        expect(lab.status).toContain('Discontinua');
        lab.mode = 3;
        lab.exponent = 5;
        expect(Math.abs(lab.rightSlope)).toBeLessThanOrEqual(lab.h);
    });
    it('finds the global optima of the three geometric models', () => {
        const lab = new DerivativeOptimizationArticleComponent();
        expect(lab.optimum).toBe(10);
        expect(lab.value(lab.optimum)).toBe(100);
        lab.mode = 1;
        lab.select();
        expect(lab.optimum).toBe(2);
        expect(lab.value(lab.optimum)).toBe(128);
        lab.mode = 2;
        lab.select();
        expect(lab.optimum).toBeCloseTo(Math.sqrt(2.5), 12);
        expect(lab.value(lab.optimum)).toBeCloseTo(2.75, 12);
        lab.parameter = .4;
        expect(lab.optimum).toBe(0);
    });
    it('fits the cooling observation and detects stable, oscillatory and unstable Euler steps', () => {
        const lab = new FirstOrderOdesArticleComponent();
        expect(lab.exact(0)).toBe(90);
        expect(lab.exact(10)).toBeCloseTo(60, 10);
        expect(lab.fineError).toBeLessThan(Math.abs(lab.finalEuler - lab.exact(60)));
        lab.k = .2;
        lab.h = 6;
        lab.update();
        expect(lab.stability).toContain('Oscilatorio');
        lab.h = 10;
        expect(lab.stability).toContain('No amortigua');
        lab.h = 11;
        expect(lab.stability).toBe('Inestable');
        lab.initial = lab.ambient;
        lab.update();
        expect(lab.finalEuler).toBe(lab.ambient);
    });
    it('normalizes hypergeometric laws and reproduces their mean and finite population variance', () => {
        for (let N = 2; N <= 12; N++)
            for (let K = 0; K <= N; K++)
                for (let n = 1; n <= N; n++) {
                    const p = hypergeometric(N, K, n), mean = p.reduce((s, v, k) => s + v * k, 0), variance = p.reduce((s, v, k) => s + v * (k - mean) ** 2, 0);
                    expect(p.reduce((s, v) => s + v, 0)).toBeCloseTo(1, 10);
                    expect(mean).toBeCloseTo(n * K / N, 10);
                    expect(variance).toBeCloseTo(n * (K / N) * (1 - K / N) * (N - n) / (N - 1), 10);
                }
        const lab = new HypergeometricDistributionArticleComponent();
        expect(lab.probabilities[2]).toBeCloseTo(15 / 28, 12);
        lab.N = 2;
        lab.K = 5;
        lab.n = 3;
        lab.update();
        expect(lab.K).toBe(2);
        expect(lab.n).toBe(2);
    });
    it('retains geometric tail mass and includes the successful trial', () => {
        const lab = new GeometricDistributionArticleComponent();
        expect(lab.tail).toBe(27 / 64);
        expect(lab.mean).toBe(4);
        expect(lab.variance).toBe(12);
        expect(lab.series[0].points.reduce((s, p) => s + p[1], 0)).toBeCloseTo(1, 12);
        lab.p = 1;
        lab.update();
        lab.sample();
        expect(lab.total).toBe(500);
        expect(lab.counts[0]).toBe(500);
    });
    it('normalizes the continuous density and scales moments correctly', () => {
        const lab = new ContinuousRandomVariablesArticleComponent();
        expect(lab.coefficient).toBe(.5);
        expect(lab.probability).toBe(.25);
        expect(lab.mean).toBeCloseTo(4 / 3, 12);
        expect(lab.variance).toBeCloseTo(2 / 9, 12);
        lab.L = 4;
        lab.update();
        expect(lab.mean).toBeCloseTo(8 / 3, 12);
        expect(lab.variance).toBeCloseTo(8 / 9, 12);
        lab.power = 0;
        expect(lab.mean).toBe(2);
        expect(lab.variance).toBeCloseTo(16 / 12, 12);
        expect(lab.cdf(-1)).toBe(0);
        expect(lab.cdf(5)).toBe(1);
    });
    it('matches independent normal quantiles, p-values and sample planning examples', () => {
        expect(normalCdf(0)).toBeCloseTo(.5, 7);
        expect(normalQuantile(.975)).toBeCloseTo(1.9599639845, 5);
        const lab = new StatisticalInferenceArticleComponent();
        expect(lab.se).toBe(1);
        expect(lab.statistic).toBe(2);
        expect(lab.pValue).toBeCloseTo(.045500264, 6);
        expect(lab.rejects).toBeTrue();
        expect(lab.requiredN).toBe(385);
        lab.n = 400;
        expect(lab.se).toBe(.5);
        lab.mean = lab.nullMean;
        expect(lab.rejects).toBeFalse();
        expect(lab.pValue).toBeCloseTo(1, 7);
    });
    it('obeys Kepler scaling, eccentric anomaly and energy conservation', () => {
        const lab = new KeplerOrbitsArticleComponent(), T = lab.period, v = lab.circularSpeed;
        lab.radius = 2;
        expect(lab.period / T).toBeCloseTo(2 * Math.SQRT2, 12);
        expect(lab.circularSpeed / v).toBeCloseTo(1 / Math.SQRT2, 12);
        lab.radius = 1;
        lab.eccentricity = .8;
        for (const phase of [0, .01, .1, .25, .5, .9, 1]) {
            lab.phase = phase;
            const drawnDistance = Math.hypot(lab.position.x - lab.focusX, lab.position.y - 250) / lab.scale;
            expect(drawnDistance).toBeCloseTo(lab.distanceAU, 12);
            expect(lab.E - lab.eccentricity * Math.sin(lab.E)).toBeCloseTo(2 * Math.PI * phase, 10);
            const energy = (lab.speed * 1000) ** 2 / 2 - lab.mu / (lab.distanceAU * lab.AU);
            expect(energy / (-lab.mu / (2 * lab.radius * lab.AU))).toBeCloseTo(1, 10);
        }
        lab.phase = 0;
        const periastroSpeed = lab.speed;
        const periastroPosition = lab.position;
        lab.phase = .001;
        const periastroStep = Math.hypot(lab.position.x - periastroPosition.x, lab.position.y - periastroPosition.y);
        lab.phase = .5;
        const apoastroSpeed = lab.speed;
        const apoastroPosition = lab.position;
        lab.phase = .501;
        const apoastroStep = Math.hypot(lab.position.x - apoastroPosition.x, lab.position.y - apoastroPosition.y);
        expect(periastroSpeed / apoastroSpeed).toBeCloseTo(9, 10);
        expect(periastroStep).toBeGreaterThan(apoastroStep);
        lab.ngOnDestroy();
    });
    it('makes all ten articles navigable and referenced by a problem', () => {
        const added = [QuadraticEquationsArticleComponent, PolynomialDivisionArticleComponent, ContinuityDifferentiabilityArticleComponent, DerivativeOptimizationArticleComponent, FirstOrderOdesArticleComponent, HypergeometricDistributionArticleComponent, GeometricDistributionArticleComponent, ContinuousRandomVariablesArticleComponent, StatisticalInferenceArticleComponent, KeplerOrbitsArticleComponent];
        const catalog = [...ALGEBRA_ARTICLES, ...ANALYSIS_ARTICLES, ...CALCULUS_ARTICLES, ...PROBABILITY_ARTICLES, ...DYNAMICAL_SYSTEMS_ARTICLES];
        const provider = new ArticlesProviderServiceService();
        const navigation = provider.getNavbar().subsections!.flatMap(section => section.items);
        for (const article of added) {
            expect(catalog.map(a => a.route)).toContain(article.route);
            expect(navigation.map(n => n.route)).toContain(article.route);
            expect(PROBLEMS.some(p => p.resources.some(r => r.route === '/articles/' + article.route))).toBeTrue();
        }
    });
});
