import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MathjaxModule } from 'mathjax-angular';

import { WidgetsModule } from '../widgets/widgets.module';
import { ArticlesRoutingModule } from './articles-routing.module';

import { ArticlesContentComponent } from './articles-content/articles-content.component';
import { ArticlesNavbarComponent } from './articles-navbar/articles-navbar.component';
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
import { TOPOLOGY_ARTICLES } from './topology/topology-articles';
import { TRIGONOMETRY_ARTICLES } from './trigonometry/trigonometry-articles';

@NgModule({
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    ArticlesRoutingModule,

    // Article layout
    ArticlesContentComponent,
    ArticlesNavbarComponent,
    TestArticleComponent,

    // Article collections
    ...ANALYSIS_ARTICLES,
    ...CALCULUS_ARTICLES,
    ...COMBINATORICS_ARTICLES,
    ...COMPLEX_NUMBERS_ARTICLES,
    ...CURVES_ARTICLES,
    ...DYNAMICAL_SYSTEMS_ARTICLES,
    ...FRACTALS_ARTICLES,
    ...GEOMETRY_ARTICLES,
    ...NUMBER_THEORY_ARTICLES,
    ...PLATONIC_SOLIDS_ARTICLES,
    ...PROBABILITY_ARTICLES,
    ...TOPOLOGY_ARTICLES,
    ...TRIGONOMETRY_ARTICLES,
  ],
})
export class ArticlesModule {}
