import { UnaSucesionRadicalProblemComponent } from './una-sucesion-radical/una-sucesion-radical-problem.component';
import { UnCocienteConExponencialProblemComponent } from './un-cociente-con-exponencial/un-cociente-con-exponencial-problem.component';
import { RecurrenciaAfinProblemComponent } from './recurrencia-afin/recurrencia-afin-problem.component';
import { UnaSerieTelescopicaProblemComponent } from './una-serie-telescopica/una-serie-telescopica-problem.component';
import { ConvergenciaAbsolutaOCondicionalProblemComponent } from './convergencia-absoluta-o-condicional/convergencia-absoluta-o-condicional-problem.component';
import { UnLimiteConSenoProblemComponent } from './un-limite-con-seno/un-limite-con-seno-problem.component';
import { RacionalizacionYLimiteProblemComponent } from './racionalizacion-y-limite/racionalizacion-y-limite-problem.component';
import { ContinuidadYDerivabilidadATrozosProblemComponent } from './continuidad-y-derivabilidad-a-trozos/continuidad-y-derivabilidad-a-trozos-problem.component';
import { UnaFuncionOscilanteProblemComponent } from './una-funcion-oscilante/una-funcion-oscilante-problem.component';
import { UnaRaizUnicaSinFormulaProblemComponent } from './una-raiz-unica-sin-formula/una-raiz-unica-sin-formula-problem.component';

export const SEQUENCES_LIMITS_PROBLEMS = [
  UnaSucesionRadicalProblemComponent,
  UnCocienteConExponencialProblemComponent,
  RecurrenciaAfinProblemComponent,
  UnaSerieTelescopicaProblemComponent,
  ConvergenciaAbsolutaOCondicionalProblemComponent,
  UnLimiteConSenoProblemComponent,
  RacionalizacionYLimiteProblemComponent,
  ContinuidadYDerivabilidadATrozosProblemComponent,
  UnaFuncionOscilanteProblemComponent,
  UnaRaizUnicaSinFormulaProblemComponent,
] as const;
