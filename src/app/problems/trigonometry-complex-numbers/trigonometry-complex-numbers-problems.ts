import { UnaEcuacionTrigonometricaProblemComponent } from './una-ecuacion-trigonometrica/una-ecuacion-trigonometrica-problem.component';
import { AlturaDesdeDosPosicionesProblemComponent } from './altura-desde-dos-posiciones/altura-desde-dos-posiciones-problem.component';
import { AnguloTripleProblemComponent } from './angulo-triple/angulo-triple-problem.component';
import { SumaDeSenosProblemComponent } from './suma-de-senos/suma-de-senos-problem.component';
import { UnTrianguloConAnguloConocidoProblemComponent } from './un-triangulo-con-angulo-conocido/un-triangulo-con-angulo-conocido-problem.component';
import { RaicesCuartasDe1ProblemComponent } from './raices-cuartas-de-1/raices-cuartas-de-1-problem.component';
import { UnLugarDePuntosComplejoProblemComponent } from './un-lugar-de-puntos-complejo/un-lugar-de-puntos-complejo-problem.component';
import { UnaPotenciaEnFormaPolarProblemComponent } from './una-potencia-en-forma-polar/una-potencia-en-forma-polar-problem.component';
import { UnaTransformacionDeMobiusProblemComponent } from './una-transformacion-de-mobius/una-transformacion-de-mobius-problem.component';
import { SumaDeRaicesDeLaUnidadProblemComponent } from './suma-de-raices-de-la-unidad/suma-de-raices-de-la-unidad-problem.component';

export const TRIGONOMETRY_COMPLEX_NUMBERS_PROBLEMS = [
  UnaEcuacionTrigonometricaProblemComponent,
  AlturaDesdeDosPosicionesProblemComponent,
  AnguloTripleProblemComponent,
  SumaDeSenosProblemComponent,
  UnTrianguloConAnguloConocidoProblemComponent,
  RaicesCuartasDe1ProblemComponent,
  UnLugarDePuntosComplejoProblemComponent,
  UnaPotenciaEnFormaPolarProblemComponent,
  UnaTransformacionDeMobiusProblemComponent,
  SumaDeRaicesDeLaUnidadProblemComponent,
] as const;
