import { ALGEBRA_ARTICLES } from './algebra/algebra-articles';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesContentComponent } from './articles-content/articles-content.component';
import { ArticlesIntroComponent } from './articles-intro/articles-intro.component';
import { TestArticleComponent } from './test-article/test-article.component';

import { ANALYSIS_ARTICLES } from './analysis/analysis-articles';
import { CALCULUS_ARTICLES } from './calculus/calculus-articles';
import { COMBINATORICS_ARTICLES } from './combinatorics/combinatorics-articles';
import { COMPLEX_NUMBERS_ARTICLES } from './complex-numbers/complex-numbers-articles';
import { CURVES_ARTICLES } from './curves/curves-articles';
import { DYNAMICAL_SYSTEMS_ARTICLES } from './dynamical-systems/dynamical-systems-articles';
import { FRACTALS_ARTICLES } from './fractals/fractals-articles';
import { GEOMETRY_ARTICLES } from './geometry/geometry-articles';
import { NUMBER_THEORY_ARTICLES } from './number-theory/number-theory-articles';
import { PLATONIC_SOLIDS_ARTICLES } from './platonic-solids/platonic-solids-articles';
import { PROBABILITY_ARTICLES } from './probability/probability-articles';
import { REGULAR_POLYGONS_ARTICLES } from './regular-polygons/regular-polygons-articles';
import { TOPOLOGY_ARTICLES } from './topology/topology-articles';
import { TRIGONOMETRY_ROUTES } from './trigonometry/trigonometry-articles';

const routes: Routes = [
  {
    path: '',
    component: ArticlesContentComponent,
    children: [
      { path: '', pathMatch: 'full', component: ArticlesIntroComponent },
      { path: TestArticleComponent.route, component: TestArticleComponent },

      ...ALGEBRA_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...ANALYSIS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...CALCULUS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...COMBINATORICS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...COMPLEX_NUMBERS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...CURVES_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...DYNAMICAL_SYSTEMS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...FRACTALS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...GEOMETRY_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...NUMBER_THEORY_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...PLATONIC_SOLIDS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...PROBABILITY_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...REGULAR_POLYGONS_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...TOPOLOGY_ARTICLES.map(article => ({ path: article.route, component: article })),
      ...TRIGONOMETRY_ROUTES,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
