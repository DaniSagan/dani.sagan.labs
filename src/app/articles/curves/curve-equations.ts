const equations: Record<string, string> = {
  cardioid: 'r = {{a}}(1 + \\cos\\theta)',
  rose: 'r = {{a}}\\cos({{k}}\\theta)',
  lemniscate: '(x^2+y^2)^2 = 2\\cdot {{a}}^2(x^2-y^2)',
  cassini: '\\sqrt{(x-{{a}})^2+y^2}\\sqrt{(x+{{a}})^2+y^2} = {{b}}^2',
  astroid: '|x|^{2/3}+|y|^{2/3}={{a}}^{2/3}',
  deltoid:
    '\\begin{aligned}x&=2\\cdot {{a}}\\cos t+{{a}}\\cos(2t)\\\\y&=2\\cdot {{a}}\\sin t-{{a}}\\sin(2t)\\end{aligned}',
  cycloid:
    '\\begin{aligned}x&={{a}}(t-\\sin t)\\\\y&={{a}}(1-\\cos t)\\end{aligned}',
  hypocycloid:
    '\\begin{aligned}x&=({{R}}-{{r}})\\cos t+{{r}}\\cos\\left(\\frac{{{R}}-{{r}}}{{{r}}}t\\right)\\\\y&=({{R}}-{{r}})\\sin t-{{r}}\\sin\\left(\\frac{{{R}}-{{r}}}{{{r}}}t\\right)\\end{aligned}',
  epicycloid:
    '\\begin{aligned}x&=({{R}}+{{r}})\\cos t-{{r}}\\cos\\left(\\frac{{{R}}+{{r}}}{{{r}}}t\\right)\\\\y&=({{R}}+{{r}})\\sin t-{{r}}\\sin\\left(\\frac{{{R}}+{{r}}}{{{r}}}t\\right)\\end{aligned}',
  'archimedean-spiral': 'r={{a}}+{{b}}\\theta',
  'logarithmic-spiral': 'r={{a}}e^{{{b}}\\theta}',
  lissajous:
    '\\begin{aligned}x&=\\sin({{a}}t+{{d}})\\\\y&=\\sin({{b}}t)\\end{aligned}',
  trifolium: 'r={{a}}\\cos(3\\theta)',
  cissoid: 'y^2=\\frac{x^3}{2\\cdot {{a}}-x}',
  conchoid: '(x^2+y^2)(x-{{a}})^2={{b}}^2x^2',
  'parabola-like': '\\frac{x^2}{{{a}}^2}+\\frac{y^2}{{{b}}^2}=1+x^2',
  ellipse: '\\frac{x^2}{{{a}}^2}+\\frac{y^2}{{{b}}^2}=1',
  hyperbola: '\\frac{x^2}{{{a}}^2}-\\frac{y^2}{{{b}}^2}=1',
  parabola: 'y={{a}}x^2+{{b}}x+{{c}}',
  'agnesi-witch': 'y=\\frac{{{b}}\\cdot {{a}}^2}{x^2+{{a}}^2}',
};

export function curveEquation(
  key: string,
  params?: Record<string, number>,
): string {
  return (equations[key] ?? '').replace(
    /\{\{(\w+)\}\}/g,
    (_, symbol: string) => {
      if (!params) return symbol === 'd' ? '\\delta' : symbol;
      const value = params[symbol];
      if (!Number.isFinite(value)) return symbol === 'd' ? '\\delta' : symbol;
      const formatted = String(Number(value.toPrecision(12)));
      return value < 0 ? '(' + formatted + ')' : formatted;
    },
  );
}
