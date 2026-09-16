import { CatalanNumbersArticleComponent } from './catalan-numbers/catalan-numbers-article.component';
import { PascalTriangleArticleComponent } from './pascal-triangle/pascal-triangle-article.component';
import { BinomialTheoremArticleComponent } from './binomial-theorem/binomial-theorem-article.component';
import { KonigsbergBridgesArticleComponent } from './konigsberg-bridges/konigsberg-bridges-article.component';

export const COMBINATORICS_ARTICLES = [PascalTriangleArticleComponent, BinomialTheoremArticleComponent, CatalanNumbersArticleComponent, KonigsbergBridgesArticleComponent];
export const COMBINATORICS_NAV_ITEMS = COMBINATORICS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
