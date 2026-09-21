import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { SandpileArticleComponent } from './sandpile/sandpile-article.component';

export const DYNAMICAL_SYSTEMS_ARTICLES = [
  LorenzAttractorComponent,
  SandpileArticleComponent,
] as const;

export const DYNAMICAL_SYSTEMS_NAV_ITEMS = DYNAMICAL_SYSTEMS_ARTICLES.map(
  (article) => ({ name: article.title, route: article.route }),
);
