import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { TestArticleComponent } from './test-article/test-article.component';
import { MathjaxModule } from 'mathjax-angular';
import { HomeArticleComponent } from './home-article/home-article.component';
import { PrimeDecompositionArticleComponent } from './prime-decomposition-article/prime-decomposition-article.component';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { PrimeDecompositionComponent } from './prime-decomposition/prime-decomposition.component';
import { FormsModule } from '@angular/forms';
import { ArticlesNavbarComponent } from './articles-navbar/articles-navbar.component';


@NgModule({
  declarations: [
    TestArticleComponent,
    HomeArticleComponent,
    PrimeDecompositionArticleComponent,
    PrimeDecompositionComponent,
    ArticlesNavbarComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    FormsModule
  ]
})
export class ArticlesModule { }
