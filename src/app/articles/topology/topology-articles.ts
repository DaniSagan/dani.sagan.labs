import { BanachTarskiParadoxComponent } from './banach-tarski-paradox/banach-tarski-paradox.component';
import { OpenClosedConnectedArticleComponent } from './open-closed-connected/open-closed-connected-article.component';
import { SchoenfliesWindingNumberArticleComponent } from './schoenflies-winding-number/schoenflies-winding-number-article.component';
import { SurfacesGenusEulerArticleComponent } from './surfaces-genus-euler/surfaces-genus-euler-article.component';
import { HomeomorphismsHomotopyArticleComponent } from './homeomorphisms-homotopy/homeomorphisms-homotopy-article.component';
import { CompactPerfectDisconnectedArticleComponent } from './compact-perfect-disconnected/compact-perfect-disconnected-article.component';
import { CardinalityDiagonalArticleComponent } from './cardinality-diagonal/cardinality-diagonal-article.component';
import { MobiusStripArticleComponent } from './mobius-strip/mobius-strip-article.component';
import { KleinBottleArticleComponent } from './klein-bottle/klein-bottle-article.component';
import { JordanCurveArticleComponent } from './jordan-curve/jordan-curve-article.component';

export const TOPOLOGY_ARTICLES = [
  BanachTarskiParadoxComponent,
  OpenClosedConnectedArticleComponent,
  SchoenfliesWindingNumberArticleComponent,
  SurfacesGenusEulerArticleComponent,
  HomeomorphismsHomotopyArticleComponent,
  CompactPerfectDisconnectedArticleComponent,
  CardinalityDiagonalArticleComponent,
  MobiusStripArticleComponent,
  KleinBottleArticleComponent,
  JordanCurveArticleComponent,
];
export const TOPOLOGY_NAV_ITEMS = TOPOLOGY_ARTICLES.map(article => ({ name: article.title, route: article.route }));
