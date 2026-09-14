import { ImaginaryPowerArticleComponent } from './imaginary-power/imaginary-power-article.component';

export const COMPLEX_NUMBERS_ARTICLES = [ImaginaryPowerArticleComponent];
export const COMPLEX_NUMBERS_NAV_ITEMS = COMPLEX_NUMBERS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
