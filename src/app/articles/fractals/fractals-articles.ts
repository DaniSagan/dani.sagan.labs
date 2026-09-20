import { BurningShipComponent } from './burning-ship/burning-ship.component';
import { PhoenixSetComponent } from './phoenix-set/phoenix-set.component';
import { NewtonComponent } from './newton/newton.component';
import { BifurcationDiagramComponent } from './bifurcation-diagram/bifurcation-diagram.component';
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
} from './additional-fractals';
import { ApollonianSieveComponent } from './apollonian-sieve/apollonian-sieve.component';
import { BarnsleyFernComponent } from './barnsley-fern/barnsley-fern.component';
import { CantorDustComponent } from './cantor-dust/cantor-dust.component';
import { CantorSetComponent } from './cantor-set/cantor-set.component';
import { DragonCurveComponent } from './dragon-curve/dragon-curve.component';
import { GosperCurveComponent } from './gosper-curve/gosper-curve.component';
import { HTreeComponent } from './h-tree/h-tree.component';
import { HilbertCurveComponent } from './hilbert-curve/hilbert-curve.component';
import { JuliaSetComponent } from './julia-set/julia-set.component';
import { KochSnowflakeComponent } from './koch-snowflake/koch-snowflake.component';
import { LevyCCurveComponent } from './levy-c-curve/levy-c-curve.component';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';
import { MinkowskiSausageComponent } from './minkowski-sausage/minkowski-sausage.component';
import { MultibrotComponent } from './multibrot/multibrot.component';
import { PeanoCurveComponent } from './peano-curve/peano-curve.component';
import { PythagorasTreeComponent } from './pythagoras-tree/pythagoras-tree.component';
import { SierpinskiCarpetComponent } from './sierpinski-carpet/sierpinski-carpet.component';
import { SierpinskiTriangleComponent } from './sierpinski-triangle/sierpinski-triangle.component';
import { TSquareComponent } from './t-square/t-square.component';
import { TricornComponent } from './tricorn/tricorn.component';
import { VicsekFractalComponent } from './vicsek-fractal/vicsek-fractal.component';

export const FRACTALS_ARTICLES = [
  ApollonianSieveComponent,
  BarnsleyFernComponent,
  BifurcationDiagramComponent,
  BinaryFractalTreeComponent,
  BoxFractalComponent,
  BurningShipComponent,
  CantorDustComponent,
  CantorSetComponent,
  CesaroFractalComponent,
  CrossFractalComponent,
  DragonCurveComponent,
  DurerPentagonComponent,
  FractalCanopyComponent,
  FractalPlantComponent,
  GosperCurveComponent,
  HTreeComponent,
  HexaflakeComponent,
  HilbertCurveComponent,
  JerusalemCrossComponent,
  JuliaSetComponent,
  KochAntisnowflakeComponent,
  KochCurveComponent,
  KochSnowflakeComponent,
  LevyCCurveComponent,
  MandelbrotComponent,
  MengerSpongeComponent,
  MinkowskiSausageComponent,
  MooreCurveComponent,
  MultibrotComponent,
  NewtonComponent,
  PaperfoldingCurveComponent,
  PeanoCurveComponent,
  PentaflakeComponent,
  PhoenixSetComponent,
  PythagorasTreeComponent,
  QuadraticKochIslandComponent,
  SierpinskiArrowheadComponent,
  SierpinskiCarpetComponent,
  SierpinskiCurveComponent,
  SierpinskiTriangleComponent,
  TSquareComponent,
  TerdragonComponent,
  TricornComponent,
  TwindragonComponent,
  VicsekFractalComponent,
] as const;
