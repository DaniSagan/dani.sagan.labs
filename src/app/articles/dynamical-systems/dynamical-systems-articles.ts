import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { SandpileArticleComponent } from './sandpile/sandpile-article.component';
import { DoublePendulumArticleComponent } from './double-pendulum/double-pendulum-article.component';

export const DYNAMICAL_SYSTEMS_ARTICLES = [
  LorenzAttractorComponent,
  SandpileArticleComponent,
  DoublePendulumArticleComponent,
] as const;

export const DYNAMICAL_SYSTEMS_NAV_ITEMS = DYNAMICAL_SYSTEMS_ARTICLES.map(
  (article) => ({ name: article.title, route: article.route }),
);
