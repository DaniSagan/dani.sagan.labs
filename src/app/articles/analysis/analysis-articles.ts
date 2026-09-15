import { GammaFunctionArticleComponent } from './gamma-function/gamma-function-article.component';
import { LambertWArticleComponent } from './lambert-w/lambert-w-article.component';
export const ANALYSIS_ARTICLES = [GammaFunctionArticleComponent, LambertWArticleComponent];
export const ANALYSIS_NAV_ITEMS = ANALYSIS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
