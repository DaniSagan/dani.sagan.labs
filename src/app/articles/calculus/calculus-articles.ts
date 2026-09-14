import { TaylorSeriesArticleComponent } from './taylor-series/taylor-series-article.component';

export const CALCULUS_ARTICLES = [TaylorSeriesArticleComponent];
export const CALCULUS_NAV_ITEMS = CALCULUS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
