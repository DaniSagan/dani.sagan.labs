import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { ArticlesRoutingModule } from './articles-routing.module';
import { TestArticleComponent } from './test-article/test-article.component';
import { MathjaxModule } from 'mathjax-angular';

import { FormsModule } from '@angular/forms';
import { ArticlesNavbarComponent } from './articles-navbar/articles-navbar.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { SierpinskiTriangleComponent } from './fractals/sierpinski-triangle/sierpinski-triangle.component';
import { SierpinskiCarpetComponent } from './fractals/sierpinski-carpet/sierpinski-carpet.component';
import { BarnsleyFernComponent } from './fractals/barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from './fractals/dragon-curve/dragon-curve.component';
import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { DodecahedronViewerComponent } from './platonic-solids/dodecahedron-viewer/dodecahedron-viewer.component';
import { HexahedronViewerComponent } from './platonic-solids/hexahedron-viewer/hexahedron-viewer.component';
import { IcosahedronViewerComponent } from './platonic-solids/icosahedron-viewer/icosahedron-viewer.component';
import { OctahedronViewerComponent } from './platonic-solids/octahedron-viewer/octahedron-viewer.component';
import { TetrahedronViewerComponent } from './platonic-solids/tetrahedron-viewer/tetrahedron-viewer.component';
import { RouterModule } from '@angular/router';
import { ArticlesContentComponent } from './articles-content/articles-content.component';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArithmeticDerivativeArticleComponent } from './number-theory/arithmetic-derivative/arithmetic-derivative-article.component';
import { MandelbrotComponent } from './fractals/mandelbrot/mandelbrot.component';
import { ApollonianSieveComponent } from './fractals/apollonian-sieve/apollonian-sieve.component';
import { ParabolaArticleComponent } from './curves/parabola-article/parabola-article.component';
import { PercolationDiagramComponent } from './probability/percolation-diagram/percolation-diagram.component';
import { TrigInverseTrigCompositionComponent } from './trigonometry/trig-inverse-trig-composition/trig-inverse-trig-composition.component';
import { PtolemyTheoremArticleComponent } from './geometry/ptolemy-theorem/ptolemy-theorem-article.component';
import { CardioidArticleComponent } from './curves/cardioid-article/cardioid-article.component';
import { RoseArticleComponent } from './curves/rose-article/rose-article.component';
import { LemniscateArticleComponent } from './curves/lemniscate-article/lemniscate-article.component';
import { CassiniArticleComponent } from './curves/cassini-article/cassini-article.component';
import { ArchimedeanSpiralArticleComponent } from './curves/archimedean-spiral-article/archimedean-spiral-article.component';
import { LogarithmicSpiralArticleComponent } from './curves/logarithmic-spiral-article/logarithmic-spiral-article.component';
import { AstroidArticleComponent } from './curves/astroid-article/astroid-article.component';
import { DeltoidArticleComponent } from './curves/deltoid-article/deltoid-article.component';
import { TrifoliumArticleComponent } from './curves/trifolium-article/trifolium-article.component';
import { EpicycloidArticleComponent } from './curves/epicycloid-article/epicycloid-article.component';
import { HypocycloidArticleComponent } from './curves/hypocycloid-article/hypocycloid-article.component';
import { CycloidArticleComponent } from './curves/cycloid-article/cycloid-article.component';
import { LissajousArticleComponent } from './curves/lissajous-article/lissajous-article.component';
import { ConchoidArticleComponent } from './curves/conchoid-article/conchoid-article.component';
import { CissoidArticleComponent } from './curves/cissoid-article/cissoid-article.component';
import { ParabolaLikeArticleComponent } from './curves/parabola-like-article/parabola-like-article.component';

@NgModule({
  imports: [
    CommonModule,
    // ArticlesRoutingModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    ArticlesRoutingModule,
    ArticlesContentComponent,
    TestArticleComponent,
    ArticlesNavbarComponent,
    SierpinskiTriangleComponent,
    SierpinskiCarpetComponent,
    BarnsleyFernComponent,
    DragonCurveComponent,
    MandelbrotComponent,
    ApollonianSieveComponent,
    LorenzAttractorComponent,
    DodecahedronViewerComponent,
    HexahedronViewerComponent,
    IcosahedronViewerComponent,
    OctahedronViewerComponent,
    TetrahedronViewerComponent,
    ArithmeticDerivativeArticleComponent,
    ParabolaArticleComponent,
    PtolemyTheoremArticleComponent,
    PercolationDiagramComponent,
    TrigInverseTrigCompositionComponent,
    CardioidArticleComponent,
    RoseArticleComponent,
    LemniscateArticleComponent,
    CassiniArticleComponent,
    ArchimedeanSpiralArticleComponent,
    LogarithmicSpiralArticleComponent,
    AstroidArticleComponent,
    DeltoidArticleComponent,
    TrifoliumArticleComponent,
    EpicycloidArticleComponent,
    HypocycloidArticleComponent,
    CycloidArticleComponent,
    LissajousArticleComponent,
    ConchoidArticleComponent,
    CissoidArticleComponent,
    ParabolaLikeArticleComponent
  ],
})
export class ArticlesModule {}
