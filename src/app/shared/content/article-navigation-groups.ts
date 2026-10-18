import { NavbarItem } from './navbar-item';
import { NavbarSubsection } from './navbar-subsection';

// Las rutas originales se conservan: esta clasificación solo organiza el menú.
const GROUPS = {
  combinatorics: [
    ['Ramsey, crecimiento y grandes números', 'ramsey-theorem graham-number googology'],
    ['Técnicas de conteo', 'counting-principles inclusion-exclusion reflection-principle grid-counting pascal-triangle binomial-theorem catalan-numbers'],
    ['Grafos y coloración', 'euler-hamilton graph-foundations konigsberg-bridges planar-euler four-color-theorem'],
    ['Simetrías y rompecabezas', 'burnside-lemma sudoku-constraints rubik-invariants'],
  ],
  algebra: [
    ['Polinomios y ecuaciones', 'polynomial-foundations equation-equivalence polynomial-division algebraic-identities-factorization quadratic-equations cubic-equation rational-root-theorem cyclotomic-polynomials sign-charts'],
    ['Álgebra lineal', 'vector-spaces change-of-basis gaussian-elimination matrix-determinant matrix-diagonalization jordan-form cayley-hamilton gram-schmidt projection-least-squares'],
    ['Desigualdades y simetrías', 'cauchy-schwarz mean-inequalities permutation-symmetries'],
  ],
  analysis: [
    ['Funciones, límites y continuidad', 'exponentials-logarithms absolute-value-distance global-extrema-weierstrass absolute-value-distance global-extrema-weierstrass asymptotic-limits squeeze-oscillation continuity-differentiability bolzano-theorem lhopital-rule mean-value-theorems convexity-tangents'],
    ['Sucesiones y series', 'recurrent-sequences monotone-convergence geometric-series telescoping-series series-convergence positive-series-tests basel'],
    ['Funciones especiales y aproximaciones', 'gamma-function lambert-w euler-mascheroni stirling numerical-conditioning banach-fixed-point'],
    ['Fechas y tiempo', 'utc-date-arithmetic daylight-saving-time'],
  ],
  calculus: [
    ['Derivadas y estudio de funciones', 'derivative-foundations partial-derivatives-minimization linear-approximation function-analysis derivative-optimization newton-raphson'],
    ['Integrales y aplicaciones geométricas', 'integration-classical integration-advanced integration-numerical areas-revolution arc-length brachistochrone'],
    ['Series, interpolación y transformadas', 'taylor-series fourier-series polynomial-interpolation laplace-transform'],
    ['Ecuaciones diferenciales', 'first-order-odes linear-ode-systems ode-numerical-integration'],
  ],
  probability: [
    ['Fundamentos y probabilidad condicionada', 'finite-probability probability-trees conditional-independence bayes-theorem birthday-paradox monty-hall probability-inequalities large-numbers-law'],
    ['Variables aleatorias y distribuciones', 'discrete-expectation distribution-functions-tails continuous-random-variables moment-transformations bernoulli-binomial normal-distribution geometric-distribution hypergeometric-distribution student-chi-square'],
    ['Estadística descriptiva y dependencia', 'descriptive-statistics graphical-diagnostics covariance linear-regression simpson-paradox causal-inference'],
    ['Muestreo y estimación', 'sampling-distributions bessel-correction sampling-bias stratified-sampling bootstrap proportion-intervals'],
    ['Inferencia y contrastes', 'statistical-inference statistical-power central-limit-theorem'],
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
      'sierpinski-triangle sierpinski-carpet cantor-set cantor-dust vicsek-fractal t-square box-fractal cross-fractal apollonian-sieve',
    ],
    ['Polígonos y fractales espaciales', 'pentaflake hexaflake durer-pentagon menger-sponge jerusalem-cross'],
    ['Medida y dimensión', 'zero-measure-dimension fractal-measure-dimension cantor-function'],
    ['Bifurcaciones y caos', 'bifurcation-diagram feigenbaum'],
  ],
  numbers: [
    ['Demostraciones y fundamentos', 'proof-strategies mathematical-induction prime-valuations'],
    [
      'Numeración y divisibilidad',
      'numeral-systems extraordinary-bases division-algorithm divisibility-rules gcd-euclid bezout-identity',
    ],
    [
      'Primos y factorización',
      'euclids-lemma factorials-legendre fundamental-theorem-arithmetic euclid-infinitely-many-primes goldbach ulam-spiral',
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
    ['Vectores, productos y planos', 'vector-norm dot-product cross-product scalar-triple-product plane-normal vector-products'],
    ['Ángulos y sus unidades', 'complementary-supplementary-angles radians steradians dihedral-angle'],
    ['Transformaciones, convexidad y centros', 'homothety convex-hull barycenter'],
    ['Regularidad y dualidad', 'schlafli-symbol polyhedral-duality apothem'],
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
      'incircles-circumcircles line-circle power-of-point chords-secants-tangents casey-theorem apollonius-problem descartes-circles',
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
      'inspheres-circumspheres lines-planes orthogonal-projections tesseract euler-polyhedron-formula cavalieri-principle cayley-menger',
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
    ["Cúbicas y curvas racionales", 'descartes-folium neile-semicubical right-strophoid maclaurin-trisectrix tschirnhausen-cubic newton-serpentine newton-trident sluze-conchoid newton-divergent-parabola'],
    ["Cuárticas históricas", 'sylvester-bicorn algebraic-bean longchamps-piriform devils-curve gutschoven-kappa eudoxus-kampyle bullet-nose-curve proclus-hippopede ampersand-curve bow-curve'],
    ["Séxticas y construcciones algebraicas", 'cayley-sextic dumbbell-curve algebraic-butterfly algebraic-heart watt-linkage-curve cornoid-curve durer-conchoid sluze-pearls'],
    ["Distancias, óvalos y contornos", 'circle-curve cartesian-oval perseus-spiric reuleaux-triangle-curve stadium-curve lame-superellipse fernandez-guasti-squircle three-focus-ellipse'],
    ["Espirales y recorridos angulares", 'fermat-spiral hyperbolic-spiral lituus-spiral euler-clothoid epispiral-curve poinsot-spiral cochleoid-curve theodorus-spiral'],
    ["Rodaduras y curvas de movimiento", 'trochoid-curve epitrochoid-curve hypotrochoid-curve nephroid-curve freeth-nephroid ceva-cycloid pascal-limacon talbot-curve'],
    ["Geometría diferencial y equilibrio", 'circle-involute ellipse-evolute-curve catenary-curve tractrix-curve catenary-evolute euler-elastica'],
    ["Interpolación y diseño geométrico", 'quadratic-bezier-curve cubic-bezier-curve rational-bezier-curve cubic-hermite-curve catmull-rom-curve uniform-cubic-bspline natural-cubic-spline lagrange-interpolation-curve pythagorean-hodograph-quintic nurbs-curve'],
    ["Gráficas trascendentes y señales", 'sinusoidal-curve damped-sinusoid exponential-curve logarithmic-curve logistic-curve gompertz-curve hyperbolic-tangent-curve sinc-curve error-function-curve gudermannian-curve'],
    ["Polinomios, funciones especiales y densidades", 'chebyshev-curve legendre-curve hermite-probabilist-curve laguerre-curve bessel-j0-curve airy-ai-curve dawson-curve beta-density-curve gamma-density-curve student-density-curve'],
    ["Lazos, perfiles y curvas ornamentales", 'gerono-lemniscate bifolium-curve kepler-folium-curve cruciform-curve fay-butterfly gielis-superformula teardrop-curve trigonometric-egg-curve plateau-curve gear-profile-curve'],
    ["Curvas espaciales y sus proyecciones", 'circular-helix-curve conical-helix-curve viviani-curve'],
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
