import { GammaFunctionArticleComponent } from './gamma-function/gamma-function-article.component';
export const ANALYSIS_ARTICLES = [GammaFunctionArticleComponent];
export const ANALYSIS_NAV_ITEMS = ANALYSIS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
