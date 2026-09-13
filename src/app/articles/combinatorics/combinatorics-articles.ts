import { CatalanNumbersArticleComponent } from './catalan-numbers/catalan-numbers-article.component';

export const COMBINATORICS_ARTICLES = [CatalanNumbersArticleComponent];
export const COMBINATORICS_NAV_ITEMS = COMBINATORICS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
