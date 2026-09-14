import { ImaginaryPowerArticleComponent } from './imaginary-power/imaginary-power-article.component';
import { EulerIdentityArticleComponent } from './euler-identity/euler-identity-article.component';

export const COMPLEX_NUMBERS_ARTICLES = [ImaginaryPowerArticleComponent, EulerIdentityArticleComponent];
export const COMPLEX_NUMBERS_NAV_ITEMS = COMPLEX_NUMBERS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
