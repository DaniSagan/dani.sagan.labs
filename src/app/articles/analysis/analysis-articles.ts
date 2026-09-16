import { GammaFunctionArticleComponent } from './gamma-function/gamma-function-article.component';
import { LambertWArticleComponent } from './lambert-w/lambert-w-article.component';
import { EulerMascheroniArticleComponent } from './euler-mascheroni/euler-mascheroni-article.component';
export const ANALYSIS_ARTICLES = [GammaFunctionArticleComponent, LambertWArticleComponent, EulerMascheroniArticleComponent];
export const ANALYSIS_NAV_ITEMS = ANALYSIS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
