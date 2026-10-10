import { SustitucionEnUnaIntegralProblemComponent } from './sustitucion-en-una-integral/sustitucion-en-una-integral-problem.component';
import { IntegracionPorPartesProblemComponent } from './integracion-por-partes/integracion-por-partes-problem.component';
import { UnaIntegralRacionalProblemComponent } from './una-integral-racional/una-integral-racional-problem.component';
import { UnaIntegralTrigonometricaProblemComponent } from './una-integral-trigonometrica/una-integral-trigonometrica-problem.component';
import { IntegralImpropiaConParametroProblemComponent } from './integral-impropia-con-parametro/integral-impropia-con-parametro-problem.component';
import { AreaEntreDosCurvasProblemComponent } from './area-entre-dos-curvas/area-entre-dos-curvas-problem.component';
import { VolumenPorDiscosProblemComponent } from './volumen-por-discos/volumen-por-discos-problem.component';
import { LongitudDeUnaCurvaProblemComponent } from './longitud-de-una-curva/longitud-de-una-curva-problem.component';
import { TrapeciosFrenteASimpsonProblemComponent } from './trapecios-frente-a-simpson/trapecios-frente-a-simpson-problem.component';
import { UnaIntegralQueContieneProblemComponent } from './una-integral-que-contiene/una-integral-que-contiene-problem.component';

export const INTEGRAL_CALCULUS_PROBLEMS = [
  SustitucionEnUnaIntegralProblemComponent,
  IntegracionPorPartesProblemComponent,
  UnaIntegralRacionalProblemComponent,
  UnaIntegralTrigonometricaProblemComponent,
  IntegralImpropiaConParametroProblemComponent,
  AreaEntreDosCurvasProblemComponent,
  VolumenPorDiscosProblemComponent,
  LongitudDeUnaCurvaProblemComponent,
  TrapeciosFrenteASimpsonProblemComponent,
  UnaIntegralQueContieneProblemComponent,
] as const;
