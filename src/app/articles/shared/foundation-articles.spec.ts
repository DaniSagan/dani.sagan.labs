import { CauchySchwarzArticleComponent } from '../algebra/cauchy-schwarz/cauchy-schwarz-article.component';
import { GaussianEliminationArticleComponent } from '../algebra/gaussian-elimination/gaussian-elimination-article.component';
import { OrthogonalProjectionsArticleComponent } from '../geometry/orthogonal-projections/orthogonal-projections-article.component';
import { RecurrentSequencesArticleComponent } from '../analysis/recurrent-sequences/recurrent-sequences-article.component';
import { TelescopingSeriesArticleComponent } from '../analysis/telescoping-series/telescoping-series-article.component';
import { SeriesConvergenceArticleComponent } from '../analysis/series-convergence/series-convergence-article.component';
import { BolzanoTheoremArticleComponent } from '../analysis/bolzano-theorem/bolzano-theorem-article.component';
import { LinearRegressionArticleComponent } from '../probability/linear-regression/linear-regression-article.component';
import { SimpsonParadoxArticleComponent } from '../probability/simpson-paradox/simpson-paradox-article.component';
import { SamplingBiasArticleComponent } from '../probability/sampling-bias/sampling-bias-article.component';
import { PROBLEMS } from '../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../shared/content/articles-provider-service.service';
import { ALGEBRA_ARTICLES } from '../algebra/algebra-articles';
import { ANALYSIS_ARTICLES } from '../analysis/analysis-articles';
import { GEOMETRY_ARTICLES } from '../geometry/geometry-articles';
import { PROBABILITY_ARTICLES } from '../probability/probability-articles';

describe('Foundation article experiments', () => {
  it('distinguishes aligned, opposite and orthogonal unit vectors', () => {
    const lab = new CauchySchwarzArticleComponent();
    for (const angle of [0, 180]) { lab.angle = angle; expect(lab.gap).toBeCloseTo(0, 12); }
    lab.angle = 90;
    expect(lab.cosine).toBeCloseTo(0, 12);
    expect(lab.gap).toBeCloseTo(1, 12);
  });

  it('preserves the independent term during elimination and detects a contradiction', () => {
    const lab = new GaussianEliminationArticleComponent();
    lab.stage = 1; lab.parameter = 1;
    expect(lab.rows).toEqual([[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(lab.classification).toContain('indeterminado');
    lab.inconsistent = true;
    expect(lab.rows[1]).toEqual([0, 0, 0, 1]);
    expect(lab.classification).toContain('Incompatible');
    lab.parameter = 2;
    expect(lab.solution).toContain('(0.000, 1.000, 0)');
  });

  it('projects onto the translated plane and reports zero distance when it contains the point', () => {
    const lab = new OrthogonalProjectionsArticleComponent();
    expect(lab.projection).toEqual([0, -1, 1]);
    expect(lab.distance).toBeCloseTo(2 * Math.sqrt(3), 12);
    for (const offset of [-6, 0, 6, 12]) {
      lab.offset = offset;
      expect(lab.check).toBeCloseTo(0, 12);
      const residual = lab.point.map((v, i) => v - lab.projection[i]);
      expect(residual[0]).toBeCloseTo(residual[1], 12);
      expect(residual[1]).toBeCloseTo(residual[2], 12);
    }
    lab.offset = 6;
    expect(lab.distance).toBe(0);
  });

  it('keeps the radical sequence monotone and bounded, and retains the two-cycle', () => {
    const lab = new RecurrentSequencesArticleComponent();
    lab.count = 40;
    lab.terms.forEach((v, i, values) => { expect(v).toBeLessThanOrEqual(2); if (i) expect(v).toBeGreaterThanOrEqual(values[i - 1]); });
    lab.mode = 'affine'; lab.count = 6;
    expect(lab.terms[6]).toBeCloseTo(3 + 2 / 3 ** 6, 12);
    lab.mode = 'cycle'; lab.count = 4;
    expect(lab.terms).toEqual([1, 0, 1, 0, 1]);
    expect(lab.error).toBe(.5);
  });

  it('agrees with direct finite summation for both telescoping examples', () => {
    const lab = new TelescopingSeriesArticleComponent();
    for (const n of [1, 10, 1000]) {
      lab.count = n;
      const direct = Array.from({ length: n }, (_, i) => 1 / ((i + 1) * (i + 2))).reduce((s, v) => s + v, 0);
      expect(lab.sum).toBeCloseTo(direct, 12);
      expect(lab.sum + lab.boundary).toBeCloseTo(1, 12);
      lab.mode = 'divergent';
      expect(lab.sum).toBe(-n);
      lab.mode = 'convergent';
    }
  });

  it('certifies alternating harmonic partial sums and distinguishes absolute convergence', () => {
    const lab = new SeriesConvergenceArticleComponent();
    lab.exponent = 1;
    for (const n of [2, 10, 100]) {
      lab.count = n;
      expect(Math.abs(lab.sums.signed - Math.log(2))).toBeLessThanOrEqual(lab.bound);
      expect(lab.classification).toContain('condicional');
    }
    lab.exponent = 2;
    expect(lab.classification).toContain('absoluta');
  });

  it('maintains a sign-changing bisection bracket and halves its error bound', () => {
    const lab = new BolzanoTheoremArticleComponent();
    const root = .6823278038280193;
    for (const steps of [0, 1, 8, 30]) {
      lab.steps = steps;
      expect(lab.bracket.fa).toBeLessThan(0);
      expect(lab.bracket.fb).toBeGreaterThan(0);
      expect(lab.bracket.a).toBeLessThan(root);
      expect(lab.bracket.b).toBeGreaterThan(root);
      expect(lab.bracket.error).toBeCloseTo(.25 / 2 ** steps, 12);
    }
    lab.functionName = 'two';
    expect(lab.bracket.valid).toBeFalse();
    expect(lab.value(-1)).toBe(0);
    expect(lab.value(1)).toBe(0);
  });

  it('recovers the regression exercise and residual orthogonality', () => {
    const lab = new LinearRegressionArticleComponent();
    const fit = lab.fit;
    expect(fit.slope).toBe(1.5);
    expect(fit.intercept).toBe(0);
    expect(fit.r!).toBeCloseTo(Math.sqrt(3) / 2, 12);
    const residuals = lab.data.map(p => ({ x: p.x, e: p.y - fit.intercept! - fit.slope! * p.x }));
    expect(residuals.reduce((s, p) => s + p.e, 0)).toBeCloseTo(0, 12);
    expect(residuals.reduce((s, p) => s + p.e * p.x, 0)).toBeCloseTo(0, 12);
  });

  it('handles constant columns without NaN and demonstrates zero correlation with nonlinear dependence', () => {
    const lab = new LinearRegressionArticleComponent();
    lab.dataset = 'constant-x';
    expect(lab.fit.slope).toBeNull();
    expect(lab.fit.r).toBeNull();
    lab.dataset = 'constant-y';
    expect(lab.fit.r).toBeNull();
    expect(lab.fit.slope).toBe(0);
    lab.dataset = 'curve';
    expect(lab.fit.r).toBe(0);
    expect(lab.fit.sse).toBeGreaterThan(0);
  });

  it('reproduces Simpson reversal and preserves superiority with common weights', () => {
    const lab = new SimpsonParadoxArticleComponent();
    expect(lab.rateA).toBeCloseTo(39 / 110, 12);
    expect(lab.rateB).toBeCloseTo(82 / 110, 12);
    expect(lab.verdict).toContain('inversión');
    for (const weight of [0, 50, 100]) {
      lab.standardWeight = weight;
      expect(lab.standardizedA - lab.standardizedB).toBeCloseTo(.1, 12);
    }
    lab.weightA = lab.weightB = 50;
    expect(lab.rateA).toBeGreaterThan(lab.rateB);
  });

  it('reduces sampling variance without reducing selection bias', () => {
    const lab = new SamplingBiasArticleComponent();
    expect(lab.populationMean).toBe(1.6);
    const bias = lab.bias, error = lab.rmse;
    lab.sampleSize = 10000;
    expect(lab.bias).toBe(bias);
    expect(lab.standardError).toBe(.01);
    expect(lab.rmse).toBeLessThan(error);
    expect(lab.rmse).toBeGreaterThanOrEqual(Math.abs(bias));
  });
});

describe('Foundation article integration', () => {
  const associations: [any, number[]][] = [
    [CauchySchwarzArticleComponent, [14]], [GaussianEliminationArticleComponent, [16]],
    [OrthogonalProjectionsArticleComponent, [19, 28, 29]], [RecurrentSequencesArticleComponent, [41, 43]],
    [TelescopingSeriesArticleComponent, [44]], [SeriesConvergenceArticleComponent, [45]],
    [BolzanoTheoremArticleComponent, [50]], [LinearRegressionArticleComponent, [83, 85]],
    [SimpsonParadoxArticleComponent, [84]], [SamplingBiasArticleComponent, [90]],
  ];
  it('registers all ten standalone components and their fourteen problem links', () => {
    const registered: readonly any[] = [...ALGEBRA_ARTICLES, ...ANALYSIS_ARTICLES, ...GEOMETRY_ARTICLES, ...PROBABILITY_ARTICLES];
    for (const [article, numbers] of associations) {
      expect(registered).toContain(article);
      for (const number of numbers) expect(PROBLEMS[number - 1].resources.some(r => r.route === '/articles/' + article.route)).toBeTrue();
    }
  });
  it('exposes all new routes in the article navigation', () => {
    const navbar = new ArticlesProviderServiceService().getNavbar();
    const flatten = (sections: any[]): string[] => sections.flatMap(s => [...s.items.map((i: any) => i.route), ...flatten(s.subsections || [])]);
    const routes = flatten(navbar.subsections!);
    for (const [article] of associations) expect(routes).toContain(article.route);
  });
});

