import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxModule } from 'mathjax-angular';

import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../widgets/widgets.module';
import { RouterModule } from '@angular/router';
import { HomeArticleComponent } from './home-article/home-article.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    HomeRoutingModule,
    HomeArticleComponent,
  ],
})
export class HomeModule {}
