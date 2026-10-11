import { UtcDateArithmeticArticleComponent } from './utc-date-arithmetic/utc-date-arithmetic-article.component';
import { SqueezeOscillationArticleComponent } from './squeeze-oscillation/squeeze-oscillation-article.component';
import { MonotoneConvergenceArticleComponent } from './monotone-convergence/monotone-convergence-article.component';
import { MeanValueTheoremsArticleComponent } from './mean-value-theorems/mean-value-theorems-article.component';
import { ConvexityTangentsArticleComponent } from './convexity-tangents/convexity-tangents-article.component';
import { AsymptoticLimitsArticleComponent } from './asymptotic-limits/asymptotic-limits-article.component';
import { ContinuityDifferentiabilityArticleComponent } from './continuity-differentiability/continuity-differentiability-article.component';
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
  UtcDateArithmeticArticleComponent,
  SqueezeOscillationArticleComponent,
  MonotoneConvergenceArticleComponent,
  MeanValueTheoremsArticleComponent,
  ConvexityTangentsArticleComponent,
  AsymptoticLimitsArticleComponent,
  ContinuityDifferentiabilityArticleComponent,
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
