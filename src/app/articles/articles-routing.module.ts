import { Component, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { TestArticleComponent } from './test-article/test-article.component';
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
import { ArticlesContentComponent } from './articles-content/articles-content.component';
import { ArithmeticDerivativeArticleComponent } from './number-theory/arithmetic-derivative/arithmetic-derivative-article.component';
import { MandelbrotComponent } from './fractals/mandelbrot/mandelbrot.component';
import { ApollonianSieveComponent } from './fractals/apollonian-sieve/apollonian-sieve.component';
import { ParabolaArticleComponent } from './curves/parabola-article/parabola-article.component';
import { HyperbolaArticleComponent } from './curves/hyperbola-article/hyperbola-article.component';
import { EllipseArticleComponent } from './curves/ellipse-article/ellipse-article.component';
import { AgnesiWitchArticleComponent } from './curves/agnesi-witch-article/agnesi-witch-article.component';
import { BurningShipComponent } from './fractals/burning-ship/burning-ship.component';
import { PhoenixSetComponent } from './fractals/phoenix-set/phoenix-set.component';
import { NewtonComponent } from './fractals/newton/newton.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesContentComponent,
    children:
    [
      { path: SierpinskiTriangleComponent.route, component: SierpinskiTriangleComponent },
      { path: SierpinskiCarpetComponent.route, component: SierpinskiCarpetComponent },
      { path: BarnsleyFernComponent.route, component: BarnsleyFernComponent },
      { path: DragonCurveComponent.route, component: DragonCurveComponent },
      { path: MandelbrotComponent.route, component: MandelbrotComponent },
      { path: BurningShipComponent.route, component: BurningShipComponent },
      { path: PhoenixSetComponent.route, component: PhoenixSetComponent },
      { path: NewtonComponent.route, component: NewtonComponent },
      { path: ApollonianSieveComponent.route, component: ApollonianSieveComponent },
      { path: LorenzAttractorComponent.route, component: LorenzAttractorComponent },
      { path: DodecahedronViewerComponent.route, component: DodecahedronViewerComponent },
      { path: HexahedronViewerComponent.route, component: HexahedronViewerComponent },
      { path: IcosahedronViewerComponent.route, component: IcosahedronViewerComponent },
      { path: OctahedronViewerComponent.route, component: OctahedronViewerComponent },
      { path: TetrahedronViewerComponent.route, component: TetrahedronViewerComponent },
      { path: ParabolaArticleComponent.route, component: ParabolaArticleComponent },
      { path: HyperbolaArticleComponent.route, component: HyperbolaArticleComponent },
      { path: EllipseArticleComponent.route, component: EllipseArticleComponent },
      { path: AgnesiWitchArticleComponent.route, component: AgnesiWitchArticleComponent },
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
