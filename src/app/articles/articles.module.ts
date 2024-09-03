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
import { WidgetsModule } from '../widgets/widgets.module';
import { CvComponent } from './cv/cv.component';
import { SierpinskiTriangleComponent } from './sierpinski-triangle/sierpinski-triangle.component';
import { MengerSpongeComponent } from './menger-sponge/menger-sponge.component';
import { BarnsleyFernComponent } from './barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from './dragon-curve/dragon-curve.component';
import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';


@NgModule({
  declarations: [
    TestArticleComponent,
    HomeArticleComponent,
    PrimeDecompositionArticleComponent,
    PrimeDecompositionComponent,
    ArticlesNavbarComponent,
    CvComponent,
    SierpinskiTriangleComponent,
    MengerSpongeComponent,
    BarnsleyFernComponent,
    DragonCurveComponent,
    LorenzAttractorComponent,
    TicTacToeComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    WidgetsModule,
    FormsModule
  ]
})
export class ArticlesModule { }
