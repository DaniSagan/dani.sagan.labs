import { Component, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { TestArticleComponent } from './test-article/test-article.component';
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
import { ArticlesContentComponent } from './articles-content/articles-content.component';
import { ArithmeticDerivativeArticleComponent } from './number-theory/arithmetic-derivative/arithmetic-derivative-article.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesContentComponent,
    children:
    [
      { path: SierpinskiTriangleComponent.route, component: SierpinskiTriangleComponent },
      { path: MengerSpongeComponent.route, component: MengerSpongeComponent },
      { path: BarnsleyFernComponent.route, component: BarnsleyFernComponent },
      { path: DragonCurveComponent.route, component: DragonCurveComponent },
      { path: LorenzAttractorComponent.route, component: LorenzAttractorComponent },
      { path: DodecahedronViewerComponent.route, component: DodecahedronViewerComponent },
      { path: HexahedronViewerComponent.route, component: HexahedronViewerComponent },
      { path: IcosahedronViewerComponent.route, component: IcosahedronViewerComponent },
      { path: OctahedronViewerComponent.route, component: OctahedronViewerComponent },
      { path: TetrahedronViewerComponent.route, component: TetrahedronViewerComponent },
      { path: TestArticleComponent.route, component: TestArticleComponent },
      { path: ArithmeticDerivativeArticleComponent.route, component: ArithmeticDerivativeArticleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
