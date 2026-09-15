import { MobiusStripArticleComponent } from './mobius-strip/mobius-strip-article.component';

export const TOPOLOGY_ARTICLES = [MobiusStripArticleComponent];
export const TOPOLOGY_NAV_ITEMS = TOPOLOGY_ARTICLES.map(article => ({ name: article.title, route: article.route }));
