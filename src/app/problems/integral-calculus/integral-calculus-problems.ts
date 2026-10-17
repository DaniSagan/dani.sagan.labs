import { UnaPrimitivaConCondicionInicialProblemComponent } from './una-primitiva-con-condicion-inicial/una-primitiva-con-condicion-inicial-problem.component';
import { UnaIntegralComoAreaFirmadaProblemComponent } from './una-integral-como-area-firmada/una-integral-como-area-firmada-problem.component';
import { UnCambioDeVariableConExtremosProblemComponent } from './un-cambio-de-variable-con-extremos/un-cambio-de-variable-con-extremos-problem.component';
import { UnaIntegracionPorPartesCompletaProblemComponent } from './una-integracion-por-partes-completa/una-integracion-por-partes-completa-problem.component';
import { UnaIntegralImpropiaQueSiConvergeProblemComponent } from './una-integral-impropia-que-si-converge/una-integral-impropia-que-si-converge-problem.component';
import { UnSolidoAlGirarUnaRectaProblemComponent } from './un-solido-al-girar-una-recta/un-solido-al-girar-una-recta-problem.component';
import { LaLongitudExactaDeUnaRectaProblemComponent } from './la-longitud-exacta-de-una-recta/la-longitud-exacta-de-una-recta-problem.component';
import { UnValorMedioQueNoEsElPuntoMedioProblemComponent } from './un-valor-medio-que-no-es-el-punto-medio/un-valor-medio-que-no-es-el-punto-medio-problem.component';
import { TrapeciosParaUnaFuncionConvexaProblemComponent } from './trapecios-para-una-funcion-convexa/trapecios-para-una-funcion-convexa-problem.component';
import { UnPasoDeEulerYSuErrorProblemComponent } from './un-paso-de-euler-y-su-error/un-paso-de-euler-y-su-error-problem.component';
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
  UnaPrimitivaConCondicionInicialProblemComponent,
  UnaIntegralComoAreaFirmadaProblemComponent,
  UnCambioDeVariableConExtremosProblemComponent,
  UnaIntegracionPorPartesCompletaProblemComponent,
  UnaIntegralImpropiaQueSiConvergeProblemComponent,
  UnSolidoAlGirarUnaRectaProblemComponent,
  LaLongitudExactaDeUnaRectaProblemComponent,
  UnValorMedioQueNoEsElPuntoMedioProblemComponent,
  TrapeciosParaUnaFuncionConvexaProblemComponent,
  UnPasoDeEulerYSuErrorProblemComponent,
] as const;
