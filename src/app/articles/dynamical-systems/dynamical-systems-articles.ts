import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { SandpileArticleComponent } from './sandpile/sandpile-article.component';
import { DoublePendulumArticleComponent } from './double-pendulum/double-pendulum-article.component';
import { RosslerAttractorArticleComponent } from './rossler-attractor/rossler-attractor-article.component';
import { CellularAutomataArticleComponent } from './cellular-automata/cellular-automata-article.component';

export const DYNAMICAL_SYSTEMS_ARTICLES = [
  LorenzAttractorComponent,
  RosslerAttractorArticleComponent,
  SandpileArticleComponent,
  DoublePendulumArticleComponent,
  CellularAutomataArticleComponent,
] as const;

export const DYNAMICAL_SYSTEMS_NAV_ITEMS = DYNAMICAL_SYSTEMS_ARTICLES.map(
  (article) => ({ name: article.title, route: article.route }),
);
