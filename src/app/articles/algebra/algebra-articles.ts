import { CauchySchwarzArticleComponent } from './cauchy-schwarz/cauchy-schwarz-article.component';
import { GaussianEliminationArticleComponent } from './gaussian-elimination/gaussian-elimination-article.component';
﻿import { CubicEquationArticleComponent } from './cubic-equation/cubic-equation-article.component';
import { CyclotomicPolynomialsArticleComponent } from './cyclotomic-polynomials/cyclotomic-polynomials-article.component';
import { DeterminantArticleComponent } from './determinant/determinant-article.component';
import { DiagonalizationArticleComponent } from './diagonalization/diagonalization-article.component';

export const ALGEBRA_ARTICLES = [
  CauchySchwarzArticleComponent,
  GaussianEliminationArticleComponent,
  CubicEquationArticleComponent,
  CyclotomicPolynomialsArticleComponent,
  DeterminantArticleComponent,
  DiagonalizationArticleComponent,
] as const;
export const ALGEBRA_NAV_ITEMS = ALGEBRA_ARTICLES.map(article => ({ name: article.title, route: article.route }));
