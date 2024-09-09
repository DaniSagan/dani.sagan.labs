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
import { SierpinskiTriangleComponent } from './fractals/sierpinski-triangle/sierpinski-triangle.component';
import { MengerSpongeComponent } from './fractals/menger-sponge/menger-sponge.component';
import { BarnsleyFernComponent } from './fractals/barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from './fractals/dragon-curve/dragon-curve.component';
import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { GraphPlotterComponent } from './graph-plotter/graph-plotter.component';
import { DodecahedronViewerComponent } from './platonic-solids/dodecahedron-viewer/dodecahedron-viewer.component';
import { HexahedronViewerComponent } from './platonic-solids/hexahedron-viewer/hexahedron-viewer.component';
import { IcosahedronViewerComponent } from './platonic-solids/icosahedron-viewer/icosahedron-viewer.component';
import { OctahedronViewerComponent } from './platonic-solids/octahedron-viewer/octahedron-viewer.component';
import { TetrahedronViewerComponent } from './platonic-solids/tetrahedron-viewer/tetrahedron-viewer.component';
import { FourInARowComponent } from './four-in-arow/four-in-a-row.component';


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
    TicTacToeComponent,
    FourInARowComponent,
    GraphPlotterComponent,
    DodecahedronViewerComponent,
    HexahedronViewerComponent,
    IcosahedronViewerComponent,
    OctahedronViewerComponent,
    TetrahedronViewerComponent
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
