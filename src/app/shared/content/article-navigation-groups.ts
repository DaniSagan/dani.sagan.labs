import { NavbarItem } from './navbar-item';
import { NavbarSubsection } from './navbar-subsection';

// Las rutas originales se conservan: esta clasificación solo organiza el menú.
const GROUPS = {
  combinatorics: [
    ['Técnicas de conteo', 'counting-principles inclusion-exclusion reflection-principle grid-counting pascal-triangle binomial-theorem catalan-numbers'],
    ['Grafos y coloración', 'euler-hamilton konigsberg-bridges planar-euler four-color-theorem ramsey-theorem graham-number'],
    ['Simetrías y rompecabezas', 'burnside-lemma sudoku-constraints rubik-invariants'],
  ],
  algebra: [
    ['Polinomios y ecuaciones', 'polynomial-division quadratic-equations cubic-equation rational-root-theorem cyclotomic-polynomials sign-charts'],
    ['Álgebra lineal', 'vector-spaces gaussian-elimination matrix-determinant matrix-diagonalization jordan-form cayley-hamilton gram-schmidt projection-least-squares'],
    ['Desigualdades y simetrías', 'cauchy-schwarz mean-inequalities permutation-symmetries'],
  ],
  analysis: [
    ['Funciones, límites y continuidad', 'exponentials-logarithms asymptotic-limits squeeze-oscillation continuity-differentiability bolzano-theorem lhopital-rule mean-value-theorems convexity-tangents'],
    ['Sucesiones y series', 'recurrent-sequences monotone-convergence geometric-series telescoping-series series-convergence positive-series-tests basel'],
    ['Funciones especiales y aproximaciones', 'gamma-function lambert-w euler-mascheroni stirling numerical-conditioning banach-fixed-point'],
    ['Fechas y tiempo', 'utc-date-arithmetic daylight-saving-time'],
  ],
  calculus: [
    ['Derivadas y estudio de funciones', 'derivative-foundations linear-approximation function-analysis derivative-optimization newton-raphson'],
    ['Integrales y aplicaciones geométricas', 'integration-classical integration-advanced integration-numerical areas-revolution arc-length brachistochrone'],
    ['Series, interpolación y transformadas', 'taylor-series fourier-series polynomial-interpolation laplace-transform'],
    ['Ecuaciones diferenciales', 'first-order-odes linear-ode-systems ode-numerical-integration'],
  ],
  probability: [
    ['Fundamentos y probabilidad condicionada', 'finite-probability conditional-independence bayes-theorem birthday-paradox monty-hall'],
    ['Variables aleatorias y distribuciones', 'discrete-expectation continuous-random-variables moment-transformations bernoulli-binomial normal-distribution geometric-distribution hypergeometric-distribution'],
    ['Estadística e inferencia', 'descriptive-statistics graphical-diagnostics sampling-distributions bessel-correction statistical-inference linear-regression simpson-paradox sampling-bias central-limit-theorem'],
    ['Procesos y experimentos aleatorios', 'galton-board markov-chains buffon-needle percolation-diagram'],
  ],
  fractals: [
    [
      'Conjuntos del plano complejo',
      'mandelbrot-set julia-set multibrot tricorn burning-ship-fractal phoenix-set-fractal newton-set-fractal',
    ],
    [
      'Curvas de Koch',
      'koch-curve koch-snowflake koch-antisnowflake cesaro-fractal quadratic-koch-island minkowski-sausage',
    ],
    [
      'Dragones y curvas por plegado',
      'dragon-curve terdragon twindragon paperfolding-curve levy-c-curve',
    ],
    [
      'Curvas que llenan el plano',
      'hilbert-curve peano-curve gosper-curve moore-curve sierpinski-curve sierpinski-arrowhead',
    ],
    [
      'Árboles y plantas',
      'barnsley-fern h-tree pythagoras-tree binary-fractal-tree fractal-canopy fractal-plant',
    ],
    [
      'Autosimilitud y conjuntos geométricos',
      'sierpinski-triangle sierpinski-carpet cantor-set cantor-dust vicsek-fractal t-square box-fractal cross-fractal',
    ],
    ['Polígonos y fractales espaciales', 'pentaflake hexaflake durer-pentagon menger-sponge jerusalem-cross'],
    ['Medida y dimensión', 'zero-measure-dimension fractal-measure-dimension'],
    ['Bifurcaciones y caos', 'bifurcation-diagram feigenbaum'],
  ],
  numbers: [
    [
      'Numeración y divisibilidad',
      'numeral-systems extraordinary-bases division-algorithm divisibility-rules gcd-euclid bezout-identity',
    ],
    [
      'Primos y factorización',
      'euclids-lemma fundamental-theorem-arithmetic euclid-infinitely-many-primes goldbach ulam-spiral',
    ],
    [
      'Congruencias y aritmética modular',
      'modular-arithmetic linear-congruence-theorem chinese-remainder-theorem fermats-little-theorem eulers-theorem wilsons-theorem euler-totient-formula',
    ],
    [
      'Residuos y órdenes',
      'quadratic-reciprocity euler-criterion primitive-root-theorem orders-theorem',
    ],
    [
      'Ecuaciones diofánticas',
      'linear-diophantine-equations pell-equation continued-fractions sum-of-two-squares fermat-four-square-theorem',
    ],
    [
      'Divisores y números especiales',
      'divisor-sum-theorem euclid-euler-perfect-numbers perfect-numbers amicable-numbers aliquot-sequences mobius-inversion',
    ],
    [
      'Sucesiones y funciones aritméticas',
      'fibonacci-numbers bernoulli-numbers collatz riemann-zeta arithmetic-derivative',
    ],
  ],
  geometry: [
    [
      'Triángulos: medidas y proporciones',
      'heron-formula law-of-cosines thales-theorem stewart-theorem ceva-theorem menelaus-theorem',
    ],
    [
      'Triángulos: centros y construcciones',
      'euler-line nine-point-circle napoleon-theorem fermat-point erdos-mordell morley-theorem euler-triangle-formula pompeiu-theorem',
    ],
    [
      'Circunferencias y tangencias',
      'line-circle power-of-point chords-secants-tangents casey-theorem apollonius-problem descartes-circles',
    ],
    [
      'Cuadriláteros y áreas',
      'ptolemy-theorem brahmagupta-formula varignon-theorem shoelace-formula pick-theorem bretschneider-formula',
    ],
    [
      'Geometría proyectiva',
      'pascal-theorem brianchon-theorem desargues-theorem cross-ratio',
    ],
    [
      'Espacio y dimensiones',
      'lines-planes orthogonal-projections tesseract euler-polyhedron-formula cavalieri-principle cayley-menger',
    ],
    ['Patrones geométricos', 'hitomezashi'],
  ],
  curves: [
    ['Cónicas', 'parabola hyperbola ellipse'],
    ['Espirales', 'archimedean-spiral logarithmic-spiral'],
    [
      'Ruletas y cicloides',
      'cardioid astroid deltoid epicycloid hypocycloid cycloid',
    ],
    ['Curvas polares y óvalos', 'rose lemniscate cassini trifolium'],
    [
      'Otras curvas clásicas',
      'agnesi-witch lissajous conchoid cissoid parabola-like',
    ],
  ],
} as const;

export function groupArticleItems(
  items: NavbarItem[],
  category: keyof typeof GROUPS,
): NavbarSubsection[] {
  const remaining = new Set(items);
  const groups: NavbarSubsection[] = GROUPS[category]
    .map(([name, routes]) => {
      const routeSet = new Set(routes.split(' '));
      const matches = items.filter(
        (item) => remaining.has(item) && routeSet.has(item.route),
      );
      matches.forEach((item) => remaining.delete(item));
      return { name, items: matches };
    })
    .filter((group) => group.items.length > 0);

  // Un artículo nuevo sigue siendo accesible aunque aún no se haya clasificado.
  if (remaining.size)
    groups.push({ name: 'Otros temas', items: [...remaining] });
  return groups;
}
