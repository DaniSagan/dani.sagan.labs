import { NashEquilibriumArticleComponent } from './nash-equilibrium/nash-equilibrium-article.component';
import { ComputabilityFormalLanguagesArticleComponent } from './computability-formal-languages/computability-formal-languages-article.component';
import { OrdinalsGrowthArticleComponent } from './ordinals-growth/ordinals-growth-article.component';
import { RouteOptimizationComplexityArticleComponent } from './route-optimization-complexity/route-optimization-complexity-article.component';
import { PolyaCycleIndexArticleComponent } from './polya-cycle-index/polya-cycle-index-article.component';
import { TreesGraphColoringArticleComponent } from './trees-graph-coloring/trees-graph-coloring-article.component';
import { PigeonholePrincipleArticleComponent } from './pigeonhole-principle/pigeonhole-principle-article.component';
import { GraphFoundationsArticleComponent } from './graph-foundations/graph-foundations-article.component';
import { GoogologyArticleComponent } from './googology/googology-article.component';
import { EulerHamiltonArticleComponent } from './euler-hamilton/euler-hamilton-article.component';
import { SudokuConstraintsArticleComponent } from './sudoku-constraints/sudoku-constraints-article.component';
import { RubikInvariantsArticleComponent } from './rubik-invariants/rubik-invariants-article.component';
import { BurnsideLemmaArticleComponent } from './burnside-lemma/burnside-lemma-article.component';
import { InclusionExclusionArticleComponent } from './inclusion-exclusion/inclusion-exclusion-article.component';
import { CountingPrinciplesArticleComponent } from './counting-principles/counting-principles-article.component';
import { ReflectionPrincipleArticleComponent } from './reflection-principle/reflection-principle-article.component';
import { GridCountingArticleComponent } from './grid-counting/grid-counting-article.component';
import { CatalanNumbersArticleComponent } from './catalan-numbers/catalan-numbers-article.component';
import { PascalTriangleArticleComponent } from './pascal-triangle/pascal-triangle-article.component';
import { BinomialTheoremArticleComponent } from './binomial-theorem/binomial-theorem-article.component';
import { KonigsbergBridgesArticleComponent } from './konigsberg-bridges/konigsberg-bridges-article.component';
import { PlanarEulerArticleComponent } from './planar-euler/planar-euler-article.component';
import { RamseyTheoremArticleComponent } from './ramsey-theorem/ramsey-theorem-article.component';
import { FourColorTheoremArticleComponent } from './four-color-theorem/four-color-theorem-article.component';
import { GrahamNumberArticleComponent } from './graham-number/graham-number-article.component';

export const COMBINATORICS_ARTICLES = [
  NashEquilibriumArticleComponent,
  ComputabilityFormalLanguagesArticleComponent,
  OrdinalsGrowthArticleComponent,
  RouteOptimizationComplexityArticleComponent,
  PolyaCycleIndexArticleComponent,
  TreesGraphColoringArticleComponent,
  PigeonholePrincipleArticleComponent,
  GraphFoundationsArticleComponent,
  GoogologyArticleComponent,
  EulerHamiltonArticleComponent,
  SudokuConstraintsArticleComponent,
  RubikInvariantsArticleComponent,
  BurnsideLemmaArticleComponent,
  InclusionExclusionArticleComponent,
  CountingPrinciplesArticleComponent,
  ReflectionPrincipleArticleComponent,
  GridCountingArticleComponent,PascalTriangleArticleComponent, BinomialTheoremArticleComponent, CatalanNumbersArticleComponent, KonigsbergBridgesArticleComponent, PlanarEulerArticleComponent, RamseyTheoremArticleComponent, GrahamNumberArticleComponent, FourColorTheoremArticleComponent];
export const COMBINATORICS_NAV_ITEMS = COMBINATORICS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
