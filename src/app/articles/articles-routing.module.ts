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
import { BifurcationDiagramComponent } from './fractals/bifurcation-diagram/bifurcation-diagram.component';
import { PercolationDiagramComponent } from './probability/percolation-diagram/percolation-diagram.component';
import { TrigInverseTrigCompositionComponent } from './trigonometry/trig-inverse-trig-composition/trig-inverse-trig-composition.component';
import { TrigNFunctionsComponent } from './trigonometry/trig-nfunctions/trig-nfunctions.component';
import { HeptagonArticleComponent } from './regular-polygons/heptagon-article/heptagon-article.component';
import { PentagonArticleComponent } from './regular-polygons/pentagon-article/pentagon-article.component';
import { NonagonArticleComponent } from './regular-polygons/nonagon-article/nonagon-article.component';
import { TriangleArticleComponent } from './regular-polygons/triangle-article/triangle-article.component';
import { SquareArticleComponent } from './regular-polygons/square-article/square-article.component';
import { HexagonArticleComponent } from './regular-polygons/hexagon-article/hexagon-article.component';
import { OctagonArticleComponent } from './regular-polygons/octagon-article/octagon-article.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesContentComponent,
    children:
    [
      { path: SierpinskiTriangleComponent.route, component: SierpinskiTriangleComponent },
      { path: SierpinskiCarpetComponent.route, component: SierpinskiCarpetComponent },
      { path: TriangleArticleComponent.route, component: TriangleArticleComponent },
      { path: SquareArticleComponent.route, component: SquareArticleComponent },
      { path: PentagonArticleComponent.route, component: PentagonArticleComponent },
      { path: HexagonArticleComponent.route, component: HexagonArticleComponent },
      { path: HeptagonArticleComponent.route, component: HeptagonArticleComponent },
      { path: OctagonArticleComponent.route, component: OctagonArticleComponent },
      { path: NonagonArticleComponent.route, component: NonagonArticleComponent },
      { path: BarnsleyFernComponent.route, component: BarnsleyFernComponent },
      { path: DragonCurveComponent.route, component: DragonCurveComponent },
      { path: MandelbrotComponent.route, component: MandelbrotComponent },
      { path: BurningShipComponent.route, component: BurningShipComponent },
      { path: PhoenixSetComponent.route, component: PhoenixSetComponent },
      { path: NewtonComponent.route, component: NewtonComponent },
      { path: BifurcationDiagramComponent.route, component: BifurcationDiagramComponent },
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
      { path: ArithmeticDerivativeArticleComponent.route, component: ArithmeticDerivativeArticleComponent },
      { path: PercolationDiagramComponent.route, component: PercolationDiagramComponent },
      //{ path: TrigInverseTrigCompositionComponent.route, component: TrigInverseTrigCompositionComponent },
      { path: TrigInverseTrigCompositionComponent.route, loadComponent: () => import('./trigonometry/trig-inverse-trig-composition/trig-inverse-trig-composition.component').then(mod => mod.TrigInverseTrigCompositionComponent) },
      { path: TrigNFunctionsComponent.route, loadComponent: () => import('./trigonometry/trig-nfunctions/trig-nfunctions.component').then(mod => mod.TrigNFunctionsComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
