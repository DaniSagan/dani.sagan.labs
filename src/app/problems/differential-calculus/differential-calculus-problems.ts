import { UnaTangenteLogaritmicaProblemComponent } from './una-tangente-logaritmica/una-tangente-logaritmica-problem.component';
import { EstudioGlobalDeUnaFuncionProblemComponent } from './estudio-global-de-una-funcion/estudio-global-de-una-funcion-problem.component';
import { UnaDesigualdadDelLogaritmoProblemComponent } from './una-desigualdad-del-logaritmo/una-desigualdad-del-logaritmo-problem.component';
import { DosPasosDeNewtonProblemComponent } from './dos-pasos-de-newton/dos-pasos-de-newton-problem.component';
import { TaylorConControlDelErrorProblemComponent } from './taylor-con-control-del-error/taylor-con-control-del-error-problem.component';
import { RectanguloConPerimetroFijoProblemComponent } from './rectangulo-con-perimetro-fijo/rectangulo-con-perimetro-fijo-problem.component';
import { CajaSinTapaProblemComponent } from './caja-sin-tapa/caja-sin-tapa-problem.component';
import { ElPuntoMasCercanoDeUnaParabolaProblemComponent } from './el-punto-mas-cercano-de-una-parabola/el-punto-mas-cercano-de-una-parabola-problem.component';
import { EnfriamientoExponencialProblemComponent } from './enfriamiento-exponencial/enfriamiento-exponencial-problem.component';
import { OrbitasDeUnCampoVectorialProblemComponent } from './orbitas-de-un-campo-vectorial/orbitas-de-un-campo-vectorial-problem.component';

export const DIFFERENTIAL_CALCULUS_PROBLEMS = [
  UnaTangenteLogaritmicaProblemComponent,
  EstudioGlobalDeUnaFuncionProblemComponent,
  UnaDesigualdadDelLogaritmoProblemComponent,
  DosPasosDeNewtonProblemComponent,
  TaylorConControlDelErrorProblemComponent,
  RectanguloConPerimetroFijoProblemComponent,
  CajaSinTapaProblemComponent,
  ElPuntoMasCercanoDeUnaParabolaProblemComponent,
  EnfriamientoExponencialProblemComponent,
  OrbitasDeUnCampoVectorialProblemComponent,
] as const;
