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
import { KochSnowflakeComponent } from './fractals/koch-snowflake/koch-snowflake.component';
import { CantorSetComponent } from './fractals/cantor-set/cantor-set.component';
import { VicsekFractalComponent } from './fractals/vicsek-fractal/vicsek-fractal.component';
import { LevyCCurveComponent } from './fractals/levy-c-curve/levy-c-curve.component';
import { HilbertCurveComponent } from './fractals/hilbert-curve/hilbert-curve.component';
import { PeanoCurveComponent } from './fractals/peano-curve/peano-curve.component';
import { GosperCurveComponent } from './fractals/gosper-curve/gosper-curve.component';
import { MinkowskiSausageComponent } from './fractals/minkowski-sausage/minkowski-sausage.component';
import { TSquareComponent } from './fractals/t-square/t-square.component';
import { HTreeComponent } from './fractals/h-tree/h-tree.component';
import { PythagorasTreeComponent } from './fractals/pythagoras-tree/pythagoras-tree.component';
import { JuliaSetComponent } from './fractals/julia-set/julia-set.component';
import { TricornComponent } from './fractals/tricorn/tricorn.component';
import { MultibrotComponent } from './fractals/multibrot/multibrot.component';
import { CantorDustComponent } from './fractals/cantor-dust/cantor-dust.component';

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
      { path: KochSnowflakeComponent.route, component: KochSnowflakeComponent },
      { path: CantorSetComponent.route, component: CantorSetComponent },
      { path: VicsekFractalComponent.route, component: VicsekFractalComponent },
      { path: LevyCCurveComponent.route, component: LevyCCurveComponent },
      { path: HilbertCurveComponent.route, component: HilbertCurveComponent },
      { path: PeanoCurveComponent.route, component: PeanoCurveComponent },
      { path: GosperCurveComponent.route, component: GosperCurveComponent },
      { path: MinkowskiSausageComponent.route, component: MinkowskiSausageComponent },
      { path: TSquareComponent.route, component: TSquareComponent },
      { path: HTreeComponent.route, component: HTreeComponent },
      { path: PythagorasTreeComponent.route, component: PythagorasTreeComponent },
      { path: JuliaSetComponent.route, component: JuliaSetComponent },
      { path: TricornComponent.route, component: TricornComponent },
      { path: MultibrotComponent.route, component: MultibrotComponent },
      { path: CantorDustComponent.route, component: CantorDustComponent },
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
      { path: CardioidArticleComponent.route, component: CardioidArticleComponent },
      { path: RoseArticleComponent.route, component: RoseArticleComponent },
      { path: LemniscateArticleComponent.route, component: LemniscateArticleComponent },
      { path: CassiniArticleComponent.route, component: CassiniArticleComponent },
      { path: ArchimedeanSpiralArticleComponent.route, component: ArchimedeanSpiralArticleComponent },
      { path: LogarithmicSpiralArticleComponent.route, component: LogarithmicSpiralArticleComponent },
      { path: AstroidArticleComponent.route, component: AstroidArticleComponent },
      { path: DeltoidArticleComponent.route, component: DeltoidArticleComponent },
      { path: TrifoliumArticleComponent.route, component: TrifoliumArticleComponent },
      { path: EpicycloidArticleComponent.route, component: EpicycloidArticleComponent },
      { path: HypocycloidArticleComponent.route, component: HypocycloidArticleComponent },
      { path: CycloidArticleComponent.route, component: CycloidArticleComponent },
      { path: LissajousArticleComponent.route, component: LissajousArticleComponent },
      { path: ConchoidArticleComponent.route, component: ConchoidArticleComponent },
      { path: CissoidArticleComponent.route, component: CissoidArticleComponent },
      { path: ParabolaLikeArticleComponent.route, component: ParabolaLikeArticleComponent },
      { path: TestArticleComponent.route, component: TestArticleComponent },
      { path: ArithmeticDerivativeArticleComponent.route, component: ArithmeticDerivativeArticleComponent },
      { path: PtolemyTheoremArticleComponent.route, component: PtolemyTheoremArticleComponent },
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
