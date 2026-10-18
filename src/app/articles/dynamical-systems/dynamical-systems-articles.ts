import { SelfOrganizedCriticalityArticleComponent } from './self-organized-criticality/self-organized-criticality-article.component';
import { PseudorandomGeneratorsArticleComponent } from './pseudorandom-generators/pseudorandom-generators-article.component';
import { IteratedFunctionSystemsArticleComponent } from './iterated-function-systems/iterated-function-systems-article.component';
import { LSystemsArticleComponent } from './l-systems/l-systems-article.component';
import { ReturnMapsBifurcationsArticleComponent } from './return-maps-bifurcations/return-maps-bifurcations-article.component';
import { LyapunovStabilityChaosArticleComponent } from './lyapunov-stability-chaos/lyapunov-stability-chaos-article.component';
import { LangtonsAntArticleComponent } from './langtons-ant/langtons-ant-article.component';
import { FirstIntegralsArticleComponent } from './first-integrals/first-integrals-article.component';
import { LifePatternsArticleComponent } from './life-patterns/life-patterns-article.component';
import { HarmonicOscillatorArticleComponent } from './harmonic-oscillator/harmonic-oscillator-article.component';
import { KeplerOrbitsArticleComponent } from './kepler-orbits/kepler-orbits-article.component';
import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { SandpileArticleComponent } from './sandpile/sandpile-article.component';
import { DoublePendulumArticleComponent } from './double-pendulum/double-pendulum-article.component';
import { RosslerAttractorArticleComponent } from './rossler-attractor/rossler-attractor-article.component';
import { CellularAutomataArticleComponent } from './cellular-automata/cellular-automata-article.component';

export const DYNAMICAL_SYSTEMS_ARTICLES = [
  SelfOrganizedCriticalityArticleComponent,
  PseudorandomGeneratorsArticleComponent,
  IteratedFunctionSystemsArticleComponent,
  LSystemsArticleComponent,
  ReturnMapsBifurcationsArticleComponent,
  LyapunovStabilityChaosArticleComponent,
  LangtonsAntArticleComponent,
  FirstIntegralsArticleComponent,
  LifePatternsArticleComponent,
  HarmonicOscillatorArticleComponent,
  KeplerOrbitsArticleComponent,
  LorenzAttractorComponent,
  RosslerAttractorArticleComponent,
  SandpileArticleComponent,
  DoublePendulumArticleComponent,
  CellularAutomataArticleComponent,
] as const;

export const DYNAMICAL_SYSTEMS_NAV_ITEMS = DYNAMICAL_SYSTEMS_ARTICLES.map(
  (article) => ({ name: article.title, route: article.route }),
);
