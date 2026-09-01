import { Type } from '@angular/core';
import { DivisionAlgorithmComponent } from './division-algorithm/division-algorithm.component';
import { BezoutIdentityComponent } from './bezout-identity/bezout-identity.component';
import { EuclidsLemmaComponent } from './euclids-lemma/euclids-lemma.component';
import { FundamentalTheoremArithmeticComponent } from './fundamental-theorem-arithmetic/fundamental-theorem-arithmetic.component';
import { EuclidInfinitelyManyPrimesComponent } from './euclid-infinitely-many-primes/euclid-infinitely-many-primes.component';
import { LinearCongruenceTheoremComponent } from './linear-congruence-theorem/linear-congruence-theorem.component';
import { ChineseRemainderTheoremComponent } from './chinese-remainder-theorem/chinese-remainder-theorem.component';
import { FermatsLittleTheoremComponent } from './fermats-little-theorem/fermats-little-theorem.component';
import { EulersTheoremComponent } from './eulers-theorem/eulers-theorem.component';
import { WilsonsTheoremComponent } from './wilsons-theorem/wilsons-theorem.component';
import { EulerTotientFormulaComponent } from './euler-totient-formula/euler-totient-formula.component';
import { MobiusInversionComponent } from './mobius-inversion/mobius-inversion.component';
import { SumOfTwoSquaresComponent } from './sum-of-two-squares/sum-of-two-squares.component';
import { FermatFourSquareTheoremComponent } from './fermat-four-square-theorem/fermat-four-square-theorem.component';
import { QuadraticReciprocityComponent } from './quadratic-reciprocity/quadratic-reciprocity.component';
import { EulerCriterionComponent } from './euler-criterion/euler-criterion.component';
import { PrimitiveRootTheoremComponent } from './primitive-root-theorem/primitive-root-theorem.component';
import { OrdersTheoremComponent } from './orders-theorem/orders-theorem.component';
import { DivisorSumTheoremComponent } from './divisor-sum-theorem/divisor-sum-theorem.component';
import { EuclidEulerPerfectNumbersComponent } from './euclid-euler-perfect-numbers/euclid-euler-perfect-numbers.component';

interface ArticleComponent extends Type<unknown> { title: string; route: string; }

export const NUMBER_THEORY_ARTICLES: ArticleComponent[] = [
  DivisionAlgorithmComponent, BezoutIdentityComponent, EuclidsLemmaComponent,
  FundamentalTheoremArithmeticComponent, EuclidInfinitelyManyPrimesComponent,
  LinearCongruenceTheoremComponent, ChineseRemainderTheoremComponent,
  FermatsLittleTheoremComponent, EulersTheoremComponent, WilsonsTheoremComponent,
  EulerTotientFormulaComponent, MobiusInversionComponent, SumOfTwoSquaresComponent,
  FermatFourSquareTheoremComponent, QuadraticReciprocityComponent,
  EulerCriterionComponent, PrimitiveRootTheoremComponent, OrdersTheoremComponent,
  DivisorSumTheoremComponent, EuclidEulerPerfectNumbersComponent
];

export const NUMBER_THEORY_NAV_ITEMS = NUMBER_THEORY_ARTICLES.map(article => ({
  name: article.title,
  route: article.route
}));
