import { SamplingDistributionsArticleComponent } from './sampling-distributions/sampling-distributions-article.component';
import { GraphicalDiagnosticsArticleComponent } from './graphical-diagnostics/graphical-diagnostics-article.component';
import { DiscreteExpectationArticleComponent } from './discrete-expectation/discrete-expectation-article.component';
import { DescriptiveStatisticsArticleComponent } from './descriptive-statistics/descriptive-statistics-article.component';
import { ConditionalIndependenceArticleComponent } from './conditional-independence/conditional-independence-article.component';
import { BesselCorrectionArticleComponent } from './bessel-correction/bessel-correction-article.component';
import { StatisticalInferenceArticleComponent } from './statistical-inference/statistical-inference-article.component';
import { ContinuousRandomVariablesArticleComponent } from './continuous-random-variables/continuous-random-variables-article.component';
import { GeometricDistributionArticleComponent } from './geometric-distribution/geometric-distribution-article.component';
import { HypergeometricDistributionArticleComponent } from './hypergeometric-distribution/hypergeometric-distribution-article.component';
import { LinearRegressionArticleComponent } from './linear-regression/linear-regression-article.component';
import { SimpsonParadoxArticleComponent } from './simpson-paradox/simpson-paradox-article.component';
import { SamplingBiasArticleComponent } from './sampling-bias/sampling-bias-article.component';
import { BayesTheoremArticleComponent } from './bayes-theorem/bayes-theorem-article.component';
import { GaltonBoardArticleComponent } from './galton-board/galton-board-article.component';
import { BirthdayParadoxArticleComponent } from './birthday-paradox/birthday-paradox-article.component';
import { BuffonNeedleArticleComponent } from './buffon-needle/buffon-needle-article.component';
import { MontyHallArticleComponent } from './monty-hall/monty-hall-article.component';
import { PercolationDiagramComponent } from './percolation-diagram/percolation-diagram.component';
import { CentralLimitTheoremArticleComponent } from './central-limit-theorem/central-limit-theorem-article.component';
import { MarkovChainsArticleComponent } from './markov-chains/markov-chains-article.component';

export const PROBABILITY_ARTICLES = [
  SamplingDistributionsArticleComponent,
  GraphicalDiagnosticsArticleComponent,
  DiscreteExpectationArticleComponent,
  DescriptiveStatisticsArticleComponent,
  ConditionalIndependenceArticleComponent,
  BesselCorrectionArticleComponent,
  StatisticalInferenceArticleComponent,
  ContinuousRandomVariablesArticleComponent,
  GeometricDistributionArticleComponent,
  HypergeometricDistributionArticleComponent,
  LinearRegressionArticleComponent,
  SimpsonParadoxArticleComponent,
  SamplingBiasArticleComponent,
  GaltonBoardArticleComponent,
  CentralLimitTheoremArticleComponent,
  MarkovChainsArticleComponent,
  BayesTheoremArticleComponent,
  BirthdayParadoxArticleComponent,
  BuffonNeedleArticleComponent,
  MontyHallArticleComponent,
  PercolationDiagramComponent,
] as const;
