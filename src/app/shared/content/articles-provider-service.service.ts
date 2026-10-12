import { ZeroMeasureDimensionArticleComponent } from 'src/app/articles/fractals/zero-measure-dimension/zero-measure-dimension-article.component';
import { FiniteProbabilityArticleComponent } from 'src/app/articles/probability/finite-probability/finite-probability-article.component';
import { MomentTransformationsArticleComponent } from 'src/app/articles/probability/moment-transformations/moment-transformations-article.component';
import { NormalDistributionArticleComponent } from 'src/app/articles/probability/normal-distribution/normal-distribution-article.component';
import { BernoulliBinomialArticleComponent } from 'src/app/articles/probability/bernoulli-binomial/bernoulli-binomial-article.component';
import { TRIGONOMETRY_ARTICLES } from 'src/app/articles/trigonometry/trigonometry-articles';
import { FractalMeasureDimensionArticleComponent } from 'src/app/articles/fractals/fractal-measure-dimension/fractal-measure-dimension-article.component';
import { SamplingDistributionsArticleComponent } from 'src/app/articles/probability/sampling-distributions/sampling-distributions-article.component';
import { GraphicalDiagnosticsArticleComponent } from 'src/app/articles/probability/graphical-diagnostics/graphical-diagnostics-article.component';
import { DiscreteExpectationArticleComponent } from 'src/app/articles/probability/discrete-expectation/discrete-expectation-article.component';
import { DescriptiveStatisticsArticleComponent } from 'src/app/articles/probability/descriptive-statistics/descriptive-statistics-article.component';
import { ConditionalIndependenceArticleComponent } from 'src/app/articles/probability/conditional-independence/conditional-independence-article.component';
import { BesselCorrectionArticleComponent } from 'src/app/articles/probability/bessel-correction/bessel-correction-article.component';
import { StatisticalInferenceArticleComponent } from 'src/app/articles/probability/statistical-inference/statistical-inference-article.component';
import { ContinuousRandomVariablesArticleComponent } from 'src/app/articles/probability/continuous-random-variables/continuous-random-variables-article.component';
import { GeometricDistributionArticleComponent } from 'src/app/articles/probability/geometric-distribution/geometric-distribution-article.component';
import { HypergeometricDistributionArticleComponent } from 'src/app/articles/probability/hypergeometric-distribution/hypergeometric-distribution-article.component';
import { LinearRegressionArticleComponent } from 'src/app/articles/probability/linear-regression/linear-regression-article.component';
import { SimpsonParadoxArticleComponent } from 'src/app/articles/probability/simpson-paradox/simpson-paradox-article.component';
import { SamplingBiasArticleComponent } from 'src/app/articles/probability/sampling-bias/sampling-bias-article.component';
import { groupArticleItems } from './article-navigation-groups';
import { ALGEBRA_NAV_ITEMS } from 'src/app/articles/algebra/algebra-articles';
import { COMPLEX_NUMBERS_NAV_ITEMS } from 'src/app/articles/complex-numbers/complex-numbers-articles';
import { GaltonBoardArticleComponent } from 'src/app/articles/probability/galton-board/galton-board-article.component';
import { CentralLimitTheoremArticleComponent } from 'src/app/articles/probability/central-limit-theorem/central-limit-theorem-article.component';
import { MarkovChainsArticleComponent } from 'src/app/articles/probability/markov-chains/markov-chains-article.component';
import { FeigenbaumArticleComponent } from 'src/app/articles/fractals/feigenbaum/feigenbaum-article.component';
import { Injectable } from '@angular/core';
import { NavbarItem } from './navbar-item';
import { NavbarProvider } from './navbar-provider';
import { Navbar } from './navbar';
import { SierpinskiTriangleComponent } from 'src/app/articles/fractals/sierpinski-triangle/sierpinski-triangle.component';
import { SierpinskiCarpetComponent } from 'src/app/articles/fractals/sierpinski-carpet/sierpinski-carpet.component';
import { BarnsleyFernComponent } from 'src/app/articles/fractals/barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from 'src/app/articles/fractals/dragon-curve/dragon-curve.component';
import { TetrahedronViewerComponent } from 'src/app/articles/platonic-solids/tetrahedron-viewer/tetrahedron-viewer.component';
import { HexahedronViewerComponent } from 'src/app/articles/platonic-solids/hexahedron-viewer/hexahedron-viewer.component';
import { OctahedronViewerComponent } from 'src/app/articles/platonic-solids/octahedron-viewer/octahedron-viewer.component';
import { DodecahedronViewerComponent } from 'src/app/articles/platonic-solids/dodecahedron-viewer/dodecahedron-viewer.component';
import { IcosahedronViewerComponent } from 'src/app/articles/platonic-solids/icosahedron-viewer/icosahedron-viewer.component';
import { NUMBER_THEORY_NAV_ITEMS } from 'src/app/articles/number-theory/number-theory-articles';
import { COMBINATORICS_NAV_ITEMS } from 'src/app/articles/combinatorics/combinatorics-articles';
import { ANALYSIS_NAV_ITEMS } from 'src/app/articles/analysis/analysis-articles';
import { CALCULUS_NAV_ITEMS } from 'src/app/articles/calculus/calculus-articles';
import { TOPOLOGY_NAV_ITEMS } from 'src/app/articles/topology/topology-articles';
import { DYNAMICAL_SYSTEMS_NAV_ITEMS } from 'src/app/articles/dynamical-systems/dynamical-systems-articles';
import { TestArticleComponent } from 'src/app/articles/test-article/test-article.component';
import { MandelbrotComponent } from 'src/app/articles/fractals/mandelbrot/mandelbrot.component';
import { ApollonianSieveComponent } from 'src/app/articles/fractals/apollonian-sieve/apollonian-sieve.component';
import { ParabolaArticleComponent } from 'src/app/articles/curves/parabola-article/parabola-article.component';
import { HyperbolaArticleComponent } from 'src/app/articles/curves/hyperbola-article/hyperbola-article.component';
import { EllipseArticleComponent } from 'src/app/articles/curves/ellipse-article/ellipse-article.component';
import { AgnesiWitchArticleComponent } from 'src/app/articles/curves/agnesi-witch-article/agnesi-witch-article.component';
import { BurningShipComponent } from 'src/app/articles/fractals/burning-ship/burning-ship.component';
import { PhoenixSetComponent } from 'src/app/articles/fractals/phoenix-set/phoenix-set.component';
import { NewtonComponent } from 'src/app/articles/fractals/newton/newton.component';
import { BifurcationDiagramComponent } from 'src/app/articles/fractals/bifurcation-diagram/bifurcation-diagram.component';
import { PercolationDiagramComponent } from 'src/app/articles/probability/percolation-diagram/percolation-diagram.component';
import { BayesTheoremArticleComponent } from 'src/app/articles/probability/bayes-theorem/bayes-theorem-article.component';
import { BirthdayParadoxArticleComponent } from 'src/app/articles/probability/birthday-paradox/birthday-paradox-article.component';
import { MontyHallArticleComponent } from 'src/app/articles/probability/monty-hall/monty-hall-article.component';
import { BuffonNeedleArticleComponent } from 'src/app/articles/probability/buffon-needle/buffon-needle-article.component';
import { TrigInverseTrigCompositionComponent } from 'src/app/articles/trigonometry/trig-inverse-trig-composition/trig-inverse-trig-composition.component';
import { TrigNFunctionsComponent } from 'src/app/articles/trigonometry/trig-nfunctions/trig-nfunctions.component';
import { HeptagonArticleComponent } from 'src/app/articles/regular-polygons/heptagon-article/heptagon-article.component';
import { PentagonArticleComponent } from 'src/app/articles/regular-polygons/pentagon-article/pentagon-article.component';
import { NonagonArticleComponent } from 'src/app/articles/regular-polygons/nonagon-article/nonagon-article.component';
import { Triangle } from 'three';
import { TriangleArticleComponent } from 'src/app/articles/regular-polygons/triangle-article/triangle-article.component';
import { SquareArticleComponent } from 'src/app/articles/regular-polygons/square-article/square-article.component';
import { HexagonArticleComponent } from 'src/app/articles/regular-polygons/hexagon-article/hexagon-article.component';
import { OctagonArticleComponent } from 'src/app/articles/regular-polygons/octagon-article/octagon-article.component';
import { GEOMETRY_ARTICLES } from 'src/app/articles/geometry/geometry-articles';
import { KochSnowflakeComponent } from 'src/app/articles/fractals/koch-snowflake/koch-snowflake.component';
import { CantorSetComponent } from 'src/app/articles/fractals/cantor-set/cantor-set.component';
import { VicsekFractalComponent } from 'src/app/articles/fractals/vicsek-fractal/vicsek-fractal.component';
import { LevyCCurveComponent } from 'src/app/articles/fractals/levy-c-curve/levy-c-curve.component';
import { HilbertCurveComponent } from 'src/app/articles/fractals/hilbert-curve/hilbert-curve.component';
import { PeanoCurveComponent } from 'src/app/articles/fractals/peano-curve/peano-curve.component';
import { GosperCurveComponent } from 'src/app/articles/fractals/gosper-curve/gosper-curve.component';
import { MinkowskiSausageComponent } from 'src/app/articles/fractals/minkowski-sausage/minkowski-sausage.component';
import { TSquareComponent } from 'src/app/articles/fractals/t-square/t-square.component';
import { HTreeComponent } from 'src/app/articles/fractals/h-tree/h-tree.component';
import { PythagorasTreeComponent } from 'src/app/articles/fractals/pythagoras-tree/pythagoras-tree.component';
import { JuliaSetComponent } from 'src/app/articles/fractals/julia-set/julia-set.component';
import { TricornComponent } from 'src/app/articles/fractals/tricorn/tricorn.component';
import { MultibrotComponent } from 'src/app/articles/fractals/multibrot/multibrot.component';
import { CantorDustComponent } from 'src/app/articles/fractals/cantor-dust/cantor-dust.component';
import {
  BinaryFractalTreeComponent,
  BoxFractalComponent,
  CesaroFractalComponent,
  CrossFractalComponent,
  DurerPentagonComponent,
  FractalCanopyComponent,
  FractalPlantComponent,
  HexaflakeComponent,
  JerusalemCrossComponent,
  KochAntisnowflakeComponent,
  KochCurveComponent,
  MengerSpongeComponent,
  MooreCurveComponent,
  PaperfoldingCurveComponent,
  PentaflakeComponent,
  QuadraticKochIslandComponent,
  SierpinskiArrowheadComponent,
  SierpinskiCurveComponent,
  TerdragonComponent,
  TwindragonComponent,
} from 'src/app/articles/fractals/additional-fractals';

@Injectable({
  providedIn: 'root'
})
export class ArticlesProviderServiceService extends NavbarProvider {

  map: NavbarItem[] = [];

  fractals: NavbarItem[] =
  [
    { name: ZeroMeasureDimensionArticleComponent.title, route: ZeroMeasureDimensionArticleComponent.route },
    { name: FractalMeasureDimensionArticleComponent.title, route: FractalMeasureDimensionArticleComponent.route },
    { name: SierpinskiTriangleComponent.title, route: SierpinskiTriangleComponent.route },
    { name: SierpinskiCarpetComponent.title, route: SierpinskiCarpetComponent.route },
    { name: BarnsleyFernComponent.title, route: BarnsleyFernComponent.route },
    { name: DragonCurveComponent.title, route: DragonCurveComponent.route },
    { name: MandelbrotComponent.title, route: MandelbrotComponent.route },
    { name: BurningShipComponent.title, route: BurningShipComponent.route },
    { name: PhoenixSetComponent.title, route: PhoenixSetComponent.route },
    { name: NewtonComponent.title, route: NewtonComponent.route },
    { name: BifurcationDiagramComponent.title, route: BifurcationDiagramComponent.route },
    { name: FeigenbaumArticleComponent.title, route: FeigenbaumArticleComponent.route },
    { name: KochSnowflakeComponent.title, route: KochSnowflakeComponent.route },
    { name: CantorSetComponent.title, route: CantorSetComponent.route },
    { name: VicsekFractalComponent.title, route: VicsekFractalComponent.route },
    { name: LevyCCurveComponent.title, route: LevyCCurveComponent.route },
    { name: HilbertCurveComponent.title, route: HilbertCurveComponent.route },
    { name: PeanoCurveComponent.title, route: PeanoCurveComponent.route },
    { name: GosperCurveComponent.title, route: GosperCurveComponent.route },
    { name: MinkowskiSausageComponent.title, route: MinkowskiSausageComponent.route },
    { name: TSquareComponent.title, route: TSquareComponent.route },
    { name: HTreeComponent.title, route: HTreeComponent.route },
    { name: PythagorasTreeComponent.title, route: PythagorasTreeComponent.route },
    { name: JuliaSetComponent.title, route: JuliaSetComponent.route },
    { name: TricornComponent.title, route: TricornComponent.route },
    { name: MultibrotComponent.title, route: MultibrotComponent.route },
    { name: CantorDustComponent.title, route: CantorDustComponent.route },
    { name: KochCurveComponent.title, route: KochCurveComponent.route },
    { name: CesaroFractalComponent.title, route: CesaroFractalComponent.route },
    { name: QuadraticKochIslandComponent.title, route: QuadraticKochIslandComponent.route },
    { name: SierpinskiArrowheadComponent.title, route: SierpinskiArrowheadComponent.route },
    { name: SierpinskiCurveComponent.title, route: SierpinskiCurveComponent.route },
    { name: MooreCurveComponent.title, route: MooreCurveComponent.route },
    { name: FractalCanopyComponent.title, route: FractalCanopyComponent.route },
    { name: BinaryFractalTreeComponent.title, route: BinaryFractalTreeComponent.route },
    { name: FractalPlantComponent.title, route: FractalPlantComponent.route },
    { name: TerdragonComponent.title, route: TerdragonComponent.route },
    { name: TwindragonComponent.title, route: TwindragonComponent.route },
    { name: PaperfoldingCurveComponent.title, route: PaperfoldingCurveComponent.route },
    { name: BoxFractalComponent.title, route: BoxFractalComponent.route },
    { name: CrossFractalComponent.title, route: CrossFractalComponent.route },
    { name: KochAntisnowflakeComponent.title, route: KochAntisnowflakeComponent.route },
    { name: PentaflakeComponent.title, route: PentaflakeComponent.route },
    { name: HexaflakeComponent.title, route: HexaflakeComponent.route },
    { name: DurerPentagonComponent.title, route: DurerPentagonComponent.route },
    { name: MengerSpongeComponent.title, route: MengerSpongeComponent.route },
    { name: JerusalemCrossComponent.title, route: JerusalemCrossComponent.route },
    // { name: ApollonianSieveComponent.title, route: ApollonianSieveComponent.route }
  ];

  regularPolygons: NavbarItem[] =
  [
    {name: TriangleArticleComponent.title, route: TriangleArticleComponent.route },
    {name: SquareArticleComponent.title, route: SquareArticleComponent.route },
    {name: PentagonArticleComponent.title, route: PentagonArticleComponent.route },
    {name: HexagonArticleComponent.title, route: HexagonArticleComponent.route },
    {name: HeptagonArticleComponent.title, route: HeptagonArticleComponent.route },
    {name: OctagonArticleComponent.title, route: OctagonArticleComponent.route },
    {name: NonagonArticleComponent.title, route: NonagonArticleComponent.route }
  ];

  platonicSolids: NavbarItem[] =
  [
    { name: TetrahedronViewerComponent.title, route: TetrahedronViewerComponent.route },
    { name: HexahedronViewerComponent.title, route: HexahedronViewerComponent.route },
    { name: OctahedronViewerComponent.title, route: OctahedronViewerComponent.route },
    { name: DodecahedronViewerComponent.title, route: DodecahedronViewerComponent.route },
    { name: IcosahedronViewerComponent.title, route: IcosahedronViewerComponent.route }
  ];

  numericTheory: NavbarItem[] =
  [
    ...NUMBER_THEORY_NAV_ITEMS,
  ];

  curves: NavbarItem[] =
  [
    { name: ParabolaArticleComponent.title, route: ParabolaArticleComponent.route },
    { name: HyperbolaArticleComponent.title, route: HyperbolaArticleComponent.route },
    { name: EllipseArticleComponent.title, route: EllipseArticleComponent.route },
    { name: AgnesiWitchArticleComponent.title, route: AgnesiWitchArticleComponent.route },
    { name: 'Cardioide', route: 'cardioid' },
    { name: 'Rosa polar', route: 'rose' },
    { name: 'Lemniscata', route: 'lemniscate' },
    { name: 'Óvalos de Cassini', route: 'cassini' },
    { name: 'Espiral de Arquímedes', route: 'archimedean-spiral' },
    { name: 'Espiral logarítmica', route: 'logarithmic-spiral' },
    { name: 'Astroide', route: 'astroid' },
    { name: 'Deltoide', route: 'deltoid' },
    { name: 'Trifolio', route: 'trifolium' },
    { name: 'Epicicloide', route: 'epicycloid' },
    { name: 'Hipocicloide', route: 'hypocycloid' },
    { name: 'Cicloide', route: 'cycloid' },
    { name: 'Curva de Lissajous', route: 'lissajous' },
    { name: 'Concoide de Nicomedes', route: 'conchoid' },
    { name: 'Cisoide de Diocles', route: 'cissoid' },
    { name: 'Curva parabólica general', route: 'parabola-like' },
    { name: "Folium de Descartes", route: 'descartes-folium' },
    { name: "Parábola semicúbica de Neile", route: 'neile-semicubical' },
    { name: "Estrofoide recta", route: 'right-strophoid' },
    { name: "Trisectriz de Maclaurin", route: 'maclaurin-trisectrix' },
    { name: "Cúbica de Tschirnhausen", route: 'tschirnhausen-cubic' },
    { name: "Serpentina de Newton", route: 'newton-serpentine' },
    { name: "Tridente de Newton", route: 'newton-trident' },
    { name: "Concoide de Sluze", route: 'sluze-conchoid' },
    { name: "Parábolas divergentes de Newton", route: 'newton-divergent-parabola' },
    { name: "Bicorne de Sylvester", route: 'sylvester-bicorn' },
    { name: "Curva de la judía", route: 'algebraic-bean' },
    { name: "Piriforme de Longchamps", route: 'longchamps-piriform' },
    { name: "Curva del diablo", route: 'devils-curve' },
    { name: "Curva kappa de Gutschoven", route: 'gutschoven-kappa' },
    { name: "Campila de Eudoxo", route: 'eudoxus-kampyle' },
    { name: "Curva nariz de bala", route: 'bullet-nose-curve' },
    { name: "Hipopeda de Proclo", route: 'proclus-hippopede' },
    { name: "Curva ampersand", route: 'ampersand-curve' },
    { name: "Cuártica del arco", route: 'bow-curve' },
    { name: "Séxtica de Cayley", route: 'cayley-sextic' },
    { name: "Curva de la mancuerna", route: 'dumbbell-curve' },
    { name: "Mariposa algebraica", route: 'algebraic-butterfly' },
    { name: "Corazón algebraico", route: 'algebraic-heart' },
    { name: "Curva del mecanismo de Watt", route: 'watt-linkage-curve' },
    { name: "Cornoide", route: 'cornoid-curve' },
    { name: "Concoide de Dürer", route: 'durer-conchoid' },
    { name: "Perlas de Sluze", route: 'sluze-pearls' },
    { name: "Circunferencia", route: 'circle-curve' },
    { name: "Óvalo cartesiano de Descartes", route: 'cartesian-oval' },
    { name: "Secciones espíricas de Perseo", route: 'perseus-spiric' },
    { name: "Curva del triángulo de Reuleaux", route: 'reuleaux-triangle-curve' },
    { name: "Curva del estadio", route: 'stadium-curve' },
    { name: "Superelipse de Lamé", route: 'lame-superellipse' },
    { name: "Squircle de Fernández-Guasti", route: 'fernandez-guasti-squircle' },
    { name: "Elipse de tres focos", route: 'three-focus-ellipse' },
    { name: "Espiral de Fermat", route: 'fermat-spiral' },
    { name: "Espiral hiperbólica", route: 'hyperbolic-spiral' },
    { name: "Lituus", route: 'lituus-spiral' },
    { name: "Clotoide de Euler", route: 'euler-clothoid' },
    { name: "Epiespiral", route: 'epispiral-curve' },
    { name: "Espiral de Poinsot", route: 'poinsot-spiral' },
    { name: "Cocleoide", route: 'cochleoid-curve' },
    { name: "Espiral de Teodoro", route: 'theodorus-spiral' },
    { name: "Trocoide", route: 'trochoid-curve' },
    { name: "Epitrocoide", route: 'epitrochoid-curve' },
    { name: "Hipotrocoide", route: 'hypotrochoid-curve' },
    { name: "Nefroide", route: 'nephroid-curve' },
    { name: "Nefroide de Freeth", route: 'freeth-nephroid' },
    { name: "Cicloide de Ceva", route: 'ceva-cycloid' },
    { name: "Limaçón de Pascal", route: 'pascal-limacon' },
    { name: "Curva de Talbot", route: 'talbot-curve' },
    { name: "Involuta de una circunferencia", route: 'circle-involute' },
    { name: "Evoluta de una elipse", route: 'ellipse-evolute-curve' },
    { name: "Catenaria", route: 'catenary-curve' },
    { name: "Tractriz", route: 'tractrix-curve' },
    { name: "Evoluta de la catenaria", route: 'catenary-evolute' },
    { name: "Elástica de Euler", route: 'euler-elastica' },
    { name: "Curva de Bézier cuadrática", route: 'quadratic-bezier-curve' },
    { name: "Curva de Bézier cúbica", route: 'cubic-bezier-curve' },
    { name: "Curva de Bézier racional", route: 'rational-bezier-curve' },
    { name: "Curva cúbica de Hermite", route: 'cubic-hermite-curve' },
    { name: "Spline de Catmull–Rom", route: 'catmull-rom-curve' },
    { name: "B-spline cúbico uniforme", route: 'uniform-cubic-bspline' },
    { name: "Spline cúbico natural", route: 'natural-cubic-spline' },
    { name: "Curva interpoladora de Lagrange", route: 'lagrange-interpolation-curve' },
    { name: "Quíntica de hodógrafa pitagórica", route: 'pythagorean-hodograph-quintic' },
    { name: "Curva NURBS", route: 'nurbs-curve' },
    { name: "Curva sinusoidal", route: 'sinusoidal-curve' },
    { name: "Sinusoide amortiguada", route: 'damped-sinusoid' },
    { name: "Curva exponencial", route: 'exponential-curve' },
    { name: "Curva logarítmica", route: 'logarithmic-curve' },
    { name: "Curva logística", route: 'logistic-curve' },
    { name: "Curva de Gompertz", route: 'gompertz-curve' },
    { name: "Curva tangente hiperbólica", route: 'hyperbolic-tangent-curve' },
    { name: "Curva sinc", route: 'sinc-curve' },
    { name: "Curva de la función error", route: 'error-function-curve' },
    { name: "Curva gudermanniana", route: 'gudermannian-curve' },
    { name: "Curva de Chebyshev", route: 'chebyshev-curve' },
    { name: "Curva de Legendre", route: 'legendre-curve' },
    { name: "Curva de Hermite probabilista", route: 'hermite-probabilist-curve' },
    { name: "Curva de Laguerre", route: 'laguerre-curve' },
    { name: "Curva de Bessel J₀", route: 'bessel-j0-curve' },
    { name: "Curva de Airy Ai", route: 'airy-ai-curve' },
    { name: "Curva de Dawson", route: 'dawson-curve' },
    { name: "Curva de densidad beta", route: 'beta-density-curve' },
    { name: "Curva de densidad gamma", route: 'gamma-density-curve' },
    { name: "Curva t de Student", route: 'student-density-curve' },
    { name: "Lemniscata de Gerono", route: 'gerono-lemniscate' },
    { name: "Bifolium", route: 'bifolium-curve' },
    { name: "Folium de Kepler", route: 'kepler-folium-curve' },
    { name: "Curva cruciforme", route: 'cruciform-curve' },
    { name: "Mariposa trascendente de Fay", route: 'fay-butterfly' },
    { name: "Curva de la superfórmula de Gielis", route: 'gielis-superformula' },
    { name: "Curva de la lágrima", route: 'teardrop-curve' },
    { name: "Óvalo ovoide trigonométrico", route: 'trigonometric-egg-curve' },
    { name: "Curva de Plateau", route: 'plateau-curve' },
    { name: "Curva de perfil de engranaje", route: 'gear-profile-curve' },
    { name: "Hélice circular", route: 'circular-helix-curve' },
    { name: "Hélice cónica", route: 'conical-helix-curve' },
    { name: "Curva de Viviani", route: 'viviani-curve' },
  ];

  geometry: NavbarItem[] = [
    ...GEOMETRY_ARTICLES.map(article => ({ name: article.title, route: article.route }))
  ];

  probability: NavbarItem[] = [
    { name: FiniteProbabilityArticleComponent.title, route: FiniteProbabilityArticleComponent.route },
    { name: MomentTransformationsArticleComponent.title, route: MomentTransformationsArticleComponent.route },
    { name: NormalDistributionArticleComponent.title, route: NormalDistributionArticleComponent.route },
    { name: BernoulliBinomialArticleComponent.title, route: BernoulliBinomialArticleComponent.route },
    { name: SamplingDistributionsArticleComponent.title, route: SamplingDistributionsArticleComponent.route },
    { name: GraphicalDiagnosticsArticleComponent.title, route: GraphicalDiagnosticsArticleComponent.route },
    { name: DiscreteExpectationArticleComponent.title, route: DiscreteExpectationArticleComponent.route },
    { name: DescriptiveStatisticsArticleComponent.title, route: DescriptiveStatisticsArticleComponent.route },
    { name: ConditionalIndependenceArticleComponent.title, route: ConditionalIndependenceArticleComponent.route },
    { name: BesselCorrectionArticleComponent.title, route: BesselCorrectionArticleComponent.route },
    { name: HypergeometricDistributionArticleComponent.title, route: HypergeometricDistributionArticleComponent.route },
    { name: GeometricDistributionArticleComponent.title, route: GeometricDistributionArticleComponent.route },
    { name: ContinuousRandomVariablesArticleComponent.title, route: ContinuousRandomVariablesArticleComponent.route },
    { name: StatisticalInferenceArticleComponent.title, route: StatisticalInferenceArticleComponent.route },
    { name: LinearRegressionArticleComponent.title, route: LinearRegressionArticleComponent.route },
    { name: SimpsonParadoxArticleComponent.title, route: SimpsonParadoxArticleComponent.route },
    { name: SamplingBiasArticleComponent.title, route: SamplingBiasArticleComponent.route },
    { name: GaltonBoardArticleComponent.title, route: GaltonBoardArticleComponent.route },
    { name: CentralLimitTheoremArticleComponent.title, route: CentralLimitTheoremArticleComponent.route },
    { name: MarkovChainsArticleComponent.title, route: MarkovChainsArticleComponent.route },
    { name: BuffonNeedleArticleComponent.title, route: BuffonNeedleArticleComponent.route },
    { name: PercolationDiagramComponent.title, route: PercolationDiagramComponent.route },
    { name: BayesTheoremArticleComponent.title, route: BayesTheoremArticleComponent.route },
    { name: BirthdayParadoxArticleComponent.title, route: BirthdayParadoxArticleComponent.route },
    { name: MontyHallArticleComponent.title, route: MontyHallArticleComponent.route }
  ];

  trigonometry: NavbarItem[] = TRIGONOMETRY_ARTICLES.map(article => ({ name: article.title, route: article.route }));

  others: NavbarItem[] =
  [
    { name: TestArticleComponent.title, route: TestArticleComponent.route }
  ];

  override getNavbar(): Navbar {
    let result: Navbar = new Navbar();
    result.name = 'Artículos';
    result.subsections = [
      { name: 'Mapa', items: this.map },
      { name: 'Fractales', items: [], subsections: groupArticleItems(this.fractals, 'fractals') },
      { name: 'Polígonos Regulares', items: this.regularPolygons },
      { name: 'Sólidos Platónicos', items: this.platonicSolids },
      { name: 'Teoría de Números', items: [], subsections: groupArticleItems(this.numericTheory, 'numbers') },
      { name: 'Álgebra', items: [], subsections: groupArticleItems(ALGEBRA_NAV_ITEMS, 'algebra') },
      { name: 'Combinatoria', items: [], subsections: groupArticleItems(COMBINATORICS_NAV_ITEMS, 'combinatorics') },
      { name: 'Análisis Matemático', items: [], subsections: groupArticleItems(ANALYSIS_NAV_ITEMS, 'analysis') },
      { name: 'Cálculo', items: [], subsections: groupArticleItems(CALCULUS_NAV_ITEMS, 'calculus') },
      { name: 'Sistemas dinámicos', items: DYNAMICAL_SYSTEMS_NAV_ITEMS },
      { name: 'Topología', items: TOPOLOGY_NAV_ITEMS },
      { name: 'Números complejos', items: COMPLEX_NUMBERS_NAV_ITEMS },
      { name: 'Geometría', items: [], subsections: groupArticleItems(this.geometry, 'geometry') },
      { name: 'Curvas', items: [], subsections: groupArticleItems(this.curves, 'curves') },
      { name: 'Probabilidad', items: [], subsections: groupArticleItems(this.probability, 'probability') },
      { name: 'Trigonometría', items: this.trigonometry },
      { name: 'Otros', items: this.others }
    ];
    return result;
  }
}
