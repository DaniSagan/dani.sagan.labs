import { SymplecticIntegrationArticleComponent } from './symplectic-integration/symplectic-integration-article.component';
import { PicardLipschitzArticleComponent } from './picard-lipschitz/picard-lipschitz-article.component';
import { VariationsNoetherArticleComponent } from './variations-noether/variations-noether-article.component';
import { FourierTransformArticleComponent } from './fourier-transform/fourier-transform-article.component';
import { VectorCalculusArticleComponent } from './vector-calculus/vector-calculus-article.component';
import { MultipleIntegralsArticleComponent } from './multiple-integrals/multiple-integrals-article.component';
import { JacobianChangeVariablesArticleComponent } from './jacobian-change-variables/jacobian-change-variables-article.component';
import { TotalDerivativeGradientArticleComponent } from './total-derivative-gradient/total-derivative-gradient-article.component';
import { PartialDerivativesMinimizationArticleComponent } from './partial-derivatives-minimization/partial-derivatives-minimization-article.component';
import { LinearOdeSystemsArticleComponent } from './linear-ode-systems/linear-ode-systems-article.component';
import { DerivativeFoundationsArticleComponent } from './derivative-foundations/derivative-foundations-article.component';
import { OdeNumericalIntegrationArticleComponent } from './ode-numerical-integration/ode-numerical-integration-article.component';
import { LinearApproximationArticleComponent } from './linear-approximation/linear-approximation-article.component';
import { PolynomialInterpolationArticleComponent } from './polynomial-interpolation/polynomial-interpolation-article.component';
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
  SymplecticIntegrationArticleComponent,
  PicardLipschitzArticleComponent,
  VariationsNoetherArticleComponent,
  FourierTransformArticleComponent,
  VectorCalculusArticleComponent,
  MultipleIntegralsArticleComponent,
  JacobianChangeVariablesArticleComponent,
  TotalDerivativeGradientArticleComponent,
  PartialDerivativesMinimizationArticleComponent,
  LinearOdeSystemsArticleComponent,
  DerivativeFoundationsArticleComponent,
  OdeNumericalIntegrationArticleComponent,
  LinearApproximationArticleComponent,
  PolynomialInterpolationArticleComponent,
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
