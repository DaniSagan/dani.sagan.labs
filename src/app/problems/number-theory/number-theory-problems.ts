import { EuclidesYBezoutProblemComponent } from './euclides-y-bezout/euclides-y-bezout-problem.component';
import { UnaCongruenciaLinealProblemComponent } from './una-congruencia-lineal/una-congruencia-lineal-problem.component';
import { DosRelojesYUnRestoProblemComponent } from './dos-relojes-y-un-resto/dos-relojes-y-un-resto-problem.component';
import { UltimasCifrasDeUnaPotenciaProblemComponent } from './ultimas-cifras-de-una-potencia/ultimas-cifras-de-una-potencia-problem.component';
import { TotienteYCoprimalidadProblemComponent } from './totiente-y-coprimalidad/totiente-y-coprimalidad-problem.component';
import { MonedasDeDosValoresProblemComponent } from './monedas-de-dos-valores/monedas-de-dos-valores-problem.component';
import { DescensoEnUnaEcuacionDePellProblemComponent } from './descenso-en-una-ecuacion-de-pell/descenso-en-una-ecuacion-de-pell-problem.component';
import { UnaDivisibilidadUniversalProblemComponent } from './una-divisibilidad-universal/una-divisibilidad-universal-problem.component';
import { DivisoresCuadradosProblemComponent } from './divisores-cuadrados/divisores-cuadrados-problem.component';
import { IrracionalidadPorFactorizacionProblemComponent } from './irracionalidad-por-factorizacion/irracionalidad-por-factorizacion-problem.component';

export const NUMBER_THEORY_PROBLEMS = [
  EuclidesYBezoutProblemComponent,
  UnaCongruenciaLinealProblemComponent,
  DosRelojesYUnRestoProblemComponent,
  UltimasCifrasDeUnaPotenciaProblemComponent,
  TotienteYCoprimalidadProblemComponent,
  MonedasDeDosValoresProblemComponent,
  DescensoEnUnaEcuacionDePellProblemComponent,
  UnaDivisibilidadUniversalProblemComponent,
  DivisoresCuadradosProblemComponent,
  IrracionalidadPorFactorizacionProblemComponent,
] as const;
