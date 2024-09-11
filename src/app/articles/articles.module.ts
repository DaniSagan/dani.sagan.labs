import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//import { ArticlesRoutingModule } from './articles-routing.module';
import { TestArticleComponent } from './test-article/test-article.component';
import { MathjaxModule } from 'mathjax-angular';
import { HomeArticleComponent } from './home-article/home-article.component';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { FormsModule } from '@angular/forms';
import { ArticlesNavbarComponent } from './articles-navbar/articles-navbar.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { CvComponent } from './cv/cv.component';
import { SierpinskiTriangleComponent } from './fractals/sierpinski-triangle/sierpinski-triangle.component';
import { MengerSpongeComponent } from './fractals/menger-sponge/menger-sponge.component';
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


@NgModule({
  declarations: [
    ArticlesContentComponent,
    TestArticleComponent,
    HomeArticleComponent,
    ArticlesNavbarComponent,
    CvComponent,
    SierpinskiTriangleComponent,
    MengerSpongeComponent,
    BarnsleyFernComponent,
    DragonCurveComponent,
    LorenzAttractorComponent,
    DodecahedronViewerComponent,
    HexahedronViewerComponent,
    IcosahedronViewerComponent,
    OctahedronViewerComponent,
    TetrahedronViewerComponent
  ],
  imports: [
    CommonModule,
    // ArticlesRoutingModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    WidgetsModule,
    FormsModule,
    RouterModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
