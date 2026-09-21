import { CubicEquationArticleComponent } from './cubic-equation/cubic-equation-article.component';
import { CyclotomicPolynomialsArticleComponent } from './cyclotomic-polynomials/cyclotomic-polynomials-article.component';

export const ALGEBRA_ARTICLES = [CubicEquationArticleComponent, CyclotomicPolynomialsArticleComponent] as const;
export const ALGEBRA_NAV_ITEMS = ALGEBRA_ARTICLES.map(article => ({ name: article.title, route: article.route }));
