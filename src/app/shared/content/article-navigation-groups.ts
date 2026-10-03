import { NavbarItem } from './navbar-item';
import { NavbarSubsection } from './navbar-subsection';

// Las rutas originales se conservan: esta clasificación solo organiza el menú.
const GROUPS = {
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
      'sierpinski-triangle sierpinski-carpet cantor-set cantor-dust vicsek-fractal t-square box-fractal cross-fractal pentaflake hexaflake durer-pentagon menger-sponge jerusalem-cross',
    ],
    ['Bifurcaciones y caos', 'bifurcation-diagram feigenbaum'],
  ],
  numbers: [
    [
      'Numeración y divisibilidad',
      'numeral-systems division-algorithm divisibility-rules gcd-euclid bezout-identity',
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
      'power-of-point chords-secants-tangents casey-theorem apollonius-problem descartes-circles',
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
      'tesseract euler-polyhedron-formula cavalieri-principle cayley-menger',
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
