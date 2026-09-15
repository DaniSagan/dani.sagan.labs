import { MobiusStripArticleComponent } from './mobius-strip/mobius-strip-article.component';
import { KleinBottleArticleComponent } from './klein-bottle/klein-bottle-article.component';

export const TOPOLOGY_ARTICLES = [MobiusStripArticleComponent, KleinBottleArticleComponent];
export const TOPOLOGY_NAV_ITEMS = TOPOLOGY_ARTICLES.map(article => ({ name: article.title, route: article.route }));
