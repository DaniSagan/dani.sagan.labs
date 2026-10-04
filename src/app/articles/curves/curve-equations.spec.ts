import { curveEquation } from './curve-equations';
import { RoseArticleComponent } from './rose-article/rose-article.component';
import { AgnesiWitchArticleComponent } from './agnesi-witch-article/agnesi-witch-article.component';
import { ParabolaArticleComponent } from './parabola-article/parabola-article.component';

describe('Curve equations and parameter values', () => {
  it('keeps TeX commands intact and does not add MathJax delimiters', () => {
    expect(curveEquation('rose', { a: 2.4, k: 5 })).toBe(
      'r = 2.4\\cos(5\\theta)',
    );
    expect(curveEquation('rose')).toBe('r = a\\cos(k\\theta)');
    expect(curveEquation('lissajous')).toContain('\\delta');
    expect(curveEquation('rose')).not.toContain('$');
    expect(curveEquation('cissoid')).toContain('2\\cdot a');
    expect(curveEquation('deltoid')).not.toContain('\\cdota');
  });
  it('substitutes every parameter in rational and parametric equations', () => {
    const cycloid = curveEquation('cycloid', { a: 1.7 });
    expect(cycloid).toContain('1.7(t-\\sin t)');
    const cassini = curveEquation('cassini', { a: 1.4, b: 2.6 });
    expect(cassini).toContain('(x-1.4)');
    expect(cassini).toContain('(x+1.4)');
    expect(cassini).toContain('2.6^2');
    const epi = curveEquation('epicycloid', { R: 3, r: 1.2 });
    expect(epi).toContain('\\frac{3+1.2}{1.2}');
    expect(epi).not.toContain('{{');
  });
  it('uses explicit multiplication and preserves fractional precision', () => {
    expect(curveEquation('lemniscate', { a: 1.5 })).toContain('2\\cdot 1.5^2');
    expect(curveEquation('logarithmic-spiral', { a: 0.8, b: 0.35 })).toContain(
      '0.35',
    );
    expect(curveEquation('parabola', { a: -2, b: 3, c: -1 })).toBe(
      'y=(-2)x^2+3x+(-1)',
    );
  });
  it('separates numeric factors with a multiplication symbol', () => {
    expect(curveEquation('agnesi-witch')).toBe(
      'y=\\frac{b\\cdot a^2}{x^2+a^2}',
    );
    for (const [a, b] of [[2, 1], [1.5, 2.4], [-2, -3], [2, 0]]) {
      const format = (value: number) => value < 0 ? `(${value})` : String(value);
      expect(curveEquation('agnesi-witch', { a, b })).toBe(
        `y=\\frac{${format(b)}\\cdot ${format(a)}^2}{x^2+${format(a)}^2}`,
      );
    }
    expect(curveEquation('lemniscate', { a: 2 })).toContain('2\\cdot 2^2');
    expect(curveEquation('deltoid', { a: 2 })).toContain('2\\cdot 2\\cos t');
    expect(curveEquation('cissoid', { a: 2 })).toContain('2\\cdot 2-x');
  });
  it('keeps integer parameters valid and ignores an empty field', () => {
    const article = new RoseArticleComponent();
    article.params = { a: 2, k: 3 };
    spyOn(article, 'onDraw');
    article.onParamChanged('k', 3.4);
    expect(article.params.k).toBe(3);
    article.onParamChanged('k', 99);
    expect(article.params.k).toBe(8);
    article.onParamChanged('a', null as unknown as number);
    expect(article.params.a).toBe(2);
  });
  it('makes the Agnesi equation agree with the graph and its parameters', () => {
    const article = new AgnesiWitchArticleComponent();
    article.a = 2;
    article.b = 3;
    article.curveGraph = { functions: [], drawGraph: () => undefined } as any;
    article.onDraw();
    const fn = article.curveGraph.functions[0].fn;
    expect(fn(0, 3)).toBe(0);
    expect(fn(2, 1.5)).toBe(0);
    expect(fn(-2, 1.5)).toBe(0);
    expect(article.getEquation()).toBe('y=\\frac{3\\cdot 2^2}{x^2+2^2}');
  });
  it('shows the ordinate of the parabola instead of an unrelated zero equation', () => {
    const article = new ParabolaArticleComponent();
    article.a = 2;
    article.b = 3;
    article.c = 4;
    expect(article.getEquation()).toBe('y=2x^2+3x+4');
  });
});
