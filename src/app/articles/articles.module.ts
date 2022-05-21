import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { TestArticleComponent } from './test-article/test-article.component';
import { MathjaxModule } from 'mathjax-angular';
import { HomeArticleComponent } from './home-article/home-article.component';
import { PrimeDecompositionArticleComponent } from './prime-decomposition-article/prime-decomposition-article.component';


@NgModule({
  declarations: [
    TestArticleComponent,
    HomeArticleComponent,
    PrimeDecompositionArticleComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MathjaxModule.forChild()
  ]
})
export class ArticlesModule { }
