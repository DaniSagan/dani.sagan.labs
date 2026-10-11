import { FunctionAnalysisArticleComponent } from './function-analysis/function-analysis-article.component';
import { AreasRevolutionArticleComponent } from './areas-revolution/areas-revolution-article.component';
import { ArcLengthArticleComponent } from './arc-length/arc-length-article.component';
import { FirstOrderOdesArticleComponent } from './first-order-odes/first-order-odes-article.component';
import { DerivativeOptimizationArticleComponent } from './derivative-optimization/derivative-optimization-article.component';
import { TaylorSeriesArticleComponent } from './taylor-series/taylor-series-article.component';
import { IntegrationClassicalArticleComponent, IntegrationAdvancedArticleComponent, IntegrationNumericalArticleComponent } from './integration/integration-article.component';
import { LaplaceTransformArticleComponent } from './laplace-transform/laplace-transform-article.component';
import { FourierSeriesArticleComponent } from './fourier-series/fourier-series-article.component';
import { BrachistochroneArticleComponent } from './brachistochrone/brachistochrone-article.component';
import { NewtonRaphsonArticleComponent } from './newton-raphson/newton-raphson-article.component';

export const CALCULUS_ARTICLES = [
  FunctionAnalysisArticleComponent,
  AreasRevolutionArticleComponent,
  ArcLengthArticleComponent,
  FirstOrderOdesArticleComponent,
  DerivativeOptimizationArticleComponent,
  IntegrationClassicalArticleComponent,
  IntegrationAdvancedArticleComponent,
  IntegrationNumericalArticleComponent,
  TaylorSeriesArticleComponent,
  FourierSeriesArticleComponent,
  LaplaceTransformArticleComponent,
  BrachistochroneArticleComponent,
  NewtonRaphsonArticleComponent,
];
export const CALCULUS_NAV_ITEMS = CALCULUS_ARTICLES.map((article) => ({
  name: article.title,
  route: article.route,
}));
