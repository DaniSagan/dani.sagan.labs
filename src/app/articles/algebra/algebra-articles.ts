import { GaloisSolvabilityComponent } from './galois-solvability/galois-solvability.component';
import { BernsteinPolynomialsArticleComponent } from './bernstein-polynomials/bernstein-polynomials-article.component';
import { PadeKrylovMethodsArticleComponent } from './pade-krylov-methods/pade-krylov-methods-article.component';
import { GroupsCosetsLagrangeArticleComponent } from './groups-cosets-lagrange/groups-cosets-lagrange-article.component';
import { RingsFiniteFieldsArticleComponent } from './rings-finite-fields/rings-finite-fields-article.component';
import { RidgeRegularizationArticleComponent } from './ridge-regularization/ridge-regularization-article.component';
import { NonnormalTransientGrowthArticleComponent } from './nonnormal-transient-growth/nonnormal-transient-growth-article.component';
import { SingularValuesOperatorNormsArticleComponent } from './singular-values-operator-norms/singular-values-operator-norms-article.component';
import { EquivalenceQuotientsArticleComponent } from './equivalence-quotients/equivalence-quotients-article.component';
import { PolynomialFoundationsArticleComponent } from './polynomial-foundations/polynomial-foundations-article.component';
import { EquationEquivalenceArticleComponent } from './equation-equivalence/equation-equivalence-article.component';
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
  GaloisSolvabilityComponent,
  BernsteinPolynomialsArticleComponent,
  PadeKrylovMethodsArticleComponent,
  GroupsCosetsLagrangeArticleComponent,
  RingsFiniteFieldsArticleComponent,
  RidgeRegularizationArticleComponent,
  NonnormalTransientGrowthArticleComponent,
  SingularValuesOperatorNormsArticleComponent,
  EquivalenceQuotientsArticleComponent,
  PolynomialFoundationsArticleComponent,
  EquationEquivalenceArticleComponent,
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
