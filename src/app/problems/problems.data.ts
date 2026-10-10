import { NUMBER_THEORY_PROBLEMS } from './number-theory/number-theory-problems';
import { ALGEBRA_PROBLEMS } from './algebra/algebra-problems';
import { GEOMETRY_PROBLEMS } from './geometry/geometry-problems';
import { TRIGONOMETRY_COMPLEX_NUMBERS_PROBLEMS } from './trigonometry-complex-numbers/trigonometry-complex-numbers-problems';
import { SEQUENCES_LIMITS_PROBLEMS } from './sequences-limits/sequences-limits-problems';
import { DIFFERENTIAL_CALCULUS_PROBLEMS } from './differential-calculus/differential-calculus-problems';
import { INTEGRAL_CALCULUS_PROBLEMS } from './integral-calculus/integral-calculus-problems';
import { PROBABILITY_PROBLEMS } from './probability/probability-problems';
import { STATISTICS_PROBLEMS } from './statistics/statistics-problems';
import { MODELS_GAMES_PROBLEMS } from './models-games/models-games-problems';
import { ProblemBlock, problemNavigation } from './problem-catalog';

export const PROBLEM_COMPONENTS = [
  ...NUMBER_THEORY_PROBLEMS,
  ...ALGEBRA_PROBLEMS,
  ...GEOMETRY_PROBLEMS,
  ...TRIGONOMETRY_COMPLEX_NUMBERS_PROBLEMS,
  ...SEQUENCES_LIMITS_PROBLEMS,
  ...DIFFERENTIAL_CALCULUS_PROBLEMS,
  ...INTEGRAL_CALCULUS_PROBLEMS,
  ...PROBABILITY_PROBLEMS,
  ...STATISTICS_PROBLEMS,
  ...MODELS_GAMES_PROBLEMS,
] as const;

export const PROBLEM_BLOCKS: ProblemBlock[] = [
  { name: "Aritmética y teoría de números", topics: ["Divisibilidad y congruencias","Diofánticas y demostraciones"], problems: NUMBER_THEORY_PROBLEMS.map(component => component.problem) },
  { name: "Álgebra y álgebra lineal", topics: ["Polinomios y desigualdades","Matrices y sistemas"], problems: ALGEBRA_PROBLEMS.map(component => component.problem) },
  { name: "Geometría", topics: ["Triángulos y áreas","Geometría analítica y espacio"], problems: GEOMETRY_PROBLEMS.map(component => component.problem) },
  { name: "Trigonometría y números complejos", topics: ["Identidades y ecuaciones","Plano complejo"], problems: TRIGONOMETRY_COMPLEX_NUMBERS_PROBLEMS.map(component => component.problem) },
  { name: "Sucesiones, límites y continuidad", topics: ["Sucesiones y series","Límites y continuidad"], problems: SEQUENCES_LIMITS_PROBLEMS.map(component => component.problem) },
  { name: "Cálculo diferencial y optimización", topics: ["Derivadas y teoremas","Optimización y modelos"], problems: DIFFERENTIAL_CALCULUS_PROBLEMS.map(component => component.problem) },
  { name: "Integración y cálculo numérico", topics: ["Primitivas e integrales","Áreas, volúmenes y aproximación"], problems: INTEGRAL_CALCULUS_PROBLEMS.map(component => component.problem) },
  { name: "Probabilidad", topics: ["Conteo y probabilidad condicionada","Variables aleatorias"], problems: PROBABILITY_PROBLEMS.map(component => component.problem) },
  { name: "Estadística y lectura crítica de datos", topics: ["Descriptiva y regresión","Inferencia y muestreo"], problems: STATISTICS_PROBLEMS.map(component => component.problem) },
  { name: "Combinatoria, juegos y modelización", topics: ["Conteo, grafos y estrategias","Dinámica y aplicaciones"], problems: MODELS_GAMES_PROBLEMS.map(component => component.problem) },
];

export const PROBLEMS = PROBLEM_BLOCKS.flatMap(group => group.problems);
export const PROBLEM_NAVIGATION = problemNavigation(PROBLEM_BLOCKS);
