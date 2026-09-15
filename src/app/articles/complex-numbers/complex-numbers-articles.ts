import { ImaginaryPowerArticleComponent } from './imaginary-power/imaginary-power-article.component';
import { EulerIdentityArticleComponent } from './euler-identity/euler-identity-article.component';
import { MobiusTransformationsArticleComponent } from './mobius-transformations/mobius-transformations-article.component';

export const COMPLEX_NUMBERS_ARTICLES = [ImaginaryPowerArticleComponent, EulerIdentityArticleComponent, MobiusTransformationsArticleComponent];
export const COMPLEX_NUMBERS_NAV_ITEMS = COMPLEX_NUMBERS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
