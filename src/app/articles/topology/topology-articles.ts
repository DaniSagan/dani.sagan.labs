import { CompactPerfectDisconnectedArticleComponent } from './compact-perfect-disconnected/compact-perfect-disconnected-article.component';
import { CardinalityDiagonalArticleComponent } from './cardinality-diagonal/cardinality-diagonal-article.component';
import { MobiusStripArticleComponent } from './mobius-strip/mobius-strip-article.component';
import { KleinBottleArticleComponent } from './klein-bottle/klein-bottle-article.component';
import { JordanCurveArticleComponent } from './jordan-curve/jordan-curve-article.component';

export const TOPOLOGY_ARTICLES = [
  CompactPerfectDisconnectedArticleComponent,
  CardinalityDiagonalArticleComponent,
  MobiusStripArticleComponent,
  KleinBottleArticleComponent,
  JordanCurveArticleComponent,
];
export const TOPOLOGY_NAV_ITEMS = TOPOLOGY_ARTICLES.map(article => ({ name: article.title, route: article.route }));
