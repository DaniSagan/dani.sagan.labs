import { RecurrentSequencesArticleComponent } from './recurrent-sequences/recurrent-sequences-article.component';
import { TelescopingSeriesArticleComponent } from './telescoping-series/telescoping-series-article.component';
import { SeriesConvergenceArticleComponent } from './series-convergence/series-convergence-article.component';
import { BolzanoTheoremArticleComponent } from './bolzano-theorem/bolzano-theorem-article.component';
import { GammaFunctionArticleComponent } from './gamma-function/gamma-function-article.component';
import { LambertWArticleComponent } from './lambert-w/lambert-w-article.component';
import { EulerMascheroniArticleComponent } from './euler-mascheroni/euler-mascheroni-article.component';
import { BaselArticleComponent } from './basel/basel-article.component';
import { StirlingArticleComponent } from './stirling/stirling-article.component';

export const ANALYSIS_ARTICLES = [
  RecurrentSequencesArticleComponent,
  TelescopingSeriesArticleComponent,
  SeriesConvergenceArticleComponent,
  BolzanoTheoremArticleComponent,
  GammaFunctionArticleComponent,
  LambertWArticleComponent,
  EulerMascheroniArticleComponent,
  BaselArticleComponent,
  StirlingArticleComponent,
];
export const ANALYSIS_NAV_ITEMS = ANALYSIS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
