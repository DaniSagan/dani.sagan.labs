import { BayesTheoremArticleComponent } from './bayes-theorem/bayes-theorem-article.component';
import { GaltonBoardArticleComponent } from './galton-board/galton-board-article.component';
import { BirthdayParadoxArticleComponent } from './birthday-paradox/birthday-paradox-article.component';
import { BuffonNeedleArticleComponent } from './buffon-needle/buffon-needle-article.component';
import { MontyHallArticleComponent } from './monty-hall/monty-hall-article.component';
import { PercolationDiagramComponent } from './percolation-diagram/percolation-diagram.component';
import { CentralLimitTheoremArticleComponent } from './central-limit-theorem/central-limit-theorem-article.component';
import { MarkovChainsArticleComponent } from './markov-chains/markov-chains-article.component';

export const PROBABILITY_ARTICLES = [
  GaltonBoardArticleComponent,
  CentralLimitTheoremArticleComponent,
  MarkovChainsArticleComponent,
  BayesTheoremArticleComponent,
  BirthdayParadoxArticleComponent,
  BuffonNeedleArticleComponent,
  MontyHallArticleComponent,
  PercolationDiagramComponent,
] as const;
