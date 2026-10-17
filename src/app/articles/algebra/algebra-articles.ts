import { AlgebraicIdentitiesFactorizationArticleComponent } from './algebraic-identities-factorization/algebraic-identities-factorization-article.component';
import { ChangeOfBasisArticleComponent } from './change-of-basis/change-of-basis-article.component';
import { ProjectionLeastSquaresArticleComponent } from './projection-least-squares/projection-least-squares-article.component';
import { GramSchmidtArticleComponent } from './gram-schmidt/gram-schmidt-article.component';
import { VectorSpacesArticleComponent } from './vector-spaces/vector-spaces-article.component';
import { SignChartsArticleComponent } from './sign-charts/sign-charts-article.component';
import { RationalRootTheoremArticleComponent } from './rational-root-theorem/rational-root-theorem-article.component';
import { PermutationSymmetriesArticleComponent } from './permutation-symmetries/permutation-symmetries-article.component';
import { MeanInequalitiesArticleComponent } from './mean-inequalities/mean-inequalities-article.component';
import { JordanFormArticleComponent } from './jordan-form/jordan-form-article.component';
import { CayleyHamiltonArticleComponent } from './cayley-hamilton/cayley-hamilton-article.component';
import { PolynomialDivisionArticleComponent } from './polynomial-division/polynomial-division-article.component';
import { QuadraticEquationsArticleComponent } from './quadratic-equations/quadratic-equations-article.component';
import { CauchySchwarzArticleComponent } from './cauchy-schwarz/cauchy-schwarz-article.component';
import { GaussianEliminationArticleComponent } from './gaussian-elimination/gaussian-elimination-article.component';
﻿import { CubicEquationArticleComponent } from './cubic-equation/cubic-equation-article.component';
import { CyclotomicPolynomialsArticleComponent } from './cyclotomic-polynomials/cyclotomic-polynomials-article.component';
import { DeterminantArticleComponent } from './determinant/determinant-article.component';
import { DiagonalizationArticleComponent } from './diagonalization/diagonalization-article.component';

export const ALGEBRA_ARTICLES = [
  AlgebraicIdentitiesFactorizationArticleComponent,
  ChangeOfBasisArticleComponent,
  ProjectionLeastSquaresArticleComponent,
  GramSchmidtArticleComponent,
  VectorSpacesArticleComponent,
  SignChartsArticleComponent,
  RationalRootTheoremArticleComponent,
  PermutationSymmetriesArticleComponent,
  MeanInequalitiesArticleComponent,
  JordanFormArticleComponent,
  CayleyHamiltonArticleComponent,
  PolynomialDivisionArticleComponent,
  QuadraticEquationsArticleComponent,
  CauchySchwarzArticleComponent,
  GaussianEliminationArticleComponent,
  CubicEquationArticleComponent,
  CyclotomicPolynomialsArticleComponent,
  DeterminantArticleComponent,
  DiagonalizationArticleComponent,
] as const;
export const ALGEBRA_NAV_ITEMS = ALGEBRA_ARTICLES.map(article => ({ name: article.title, route: article.route }));
