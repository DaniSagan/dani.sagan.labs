import { UnaEcuacionConDenominadoresProblemComponent } from './una-ecuacion-con-denominadores/una-ecuacion-con-denominadores-problem.component';
import { UnPolinomioPorAgrupacionProblemComponent } from './un-polinomio-por-agrupacion/un-polinomio-por-agrupacion-problem.component';
import { UnaDesigualdadRacionalProblemComponent } from './una-desigualdad-racional/una-desigualdad-racional-problem.component';
import { CompletarUnCuadradoProblemComponent } from './completar-un-cuadrado/completar-un-cuadrado-problem.component';
import { UnaIdentidadQueAcotaUnProductoProblemComponent } from './una-identidad-que-acota-un-producto/una-identidad-que-acota-un-producto-problem.component';
import { CoordenadasEnUnaBaseOblicuaProblemComponent } from './coordenadas-en-una-base-oblicua/coordenadas-en-una-base-oblicua-problem.component';
import { NucleoEImagenDeUnaAplicacionProblemComponent } from './nucleo-e-imagen-de-una-aplicacion/nucleo-e-imagen-de-una-aplicacion-problem.component';
import { DosVectoresOrtonormalesProblemComponent } from './dos-vectores-ortonormales/dos-vectores-ortonormales-problem.component';
import { UnAjusteConstantePorMinimosCuadradosProblemComponent } from './un-ajuste-constante-por-minimos-cuadrados/un-ajuste-constante-por-minimos-cuadrados-problem.component';
import { UnaMatrizQueDeshaceOtraProblemComponent } from './una-matriz-que-deshace-otra/una-matriz-que-deshace-otra-problem.component';
import { UnaCubicaConTresRaicesProblemComponent } from './una-cubica-con-tres-raices/una-cubica-con-tres-raices-problem.component';
import { RaicesYParametroProblemComponent } from './raices-y-parametro/raices-y-parametro-problem.component';
import { UnRestoSinDividirProblemComponent } from './un-resto-sin-dividir/un-resto-sin-dividir-problem.component';
import { UnaDesigualdadConIgualdadProblemComponent } from './una-desigualdad-con-igualdad/una-desigualdad-con-igualdad-problem.component';
import { FraccionesParcialesProblemComponent } from './fracciones-parciales/fracciones-parciales-problem.component';
import { SistemaConParametroProblemComponent } from './sistema-con-parametro/sistema-con-parametro-problem.component';
import { PotenciasPorAutovectoresProblemComponent } from './potencias-por-autovectores/potencias-por-autovectores-problem.component';
import { UnDeterminanteGeometricoProblemComponent } from './un-determinante-geometrico/un-determinante-geometrico-problem.component';
import { ProyeccionOrtogonalProblemComponent } from './proyeccion-ortogonal/proyeccion-ortogonal-problem.component';
import { UnaMatrizNoDiagonalizableProblemComponent } from './una-matriz-no-diagonalizable/una-matriz-no-diagonalizable-problem.component';

export const ALGEBRA_PROBLEMS = [
  UnaCubicaConTresRaicesProblemComponent,
  RaicesYParametroProblemComponent,
  UnRestoSinDividirProblemComponent,
  UnaDesigualdadConIgualdadProblemComponent,
  FraccionesParcialesProblemComponent,
  SistemaConParametroProblemComponent,
  PotenciasPorAutovectoresProblemComponent,
  UnDeterminanteGeometricoProblemComponent,
  ProyeccionOrtogonalProblemComponent,
  UnaMatrizNoDiagonalizableProblemComponent,
  UnaEcuacionConDenominadoresProblemComponent,
  UnPolinomioPorAgrupacionProblemComponent,
  UnaDesigualdadRacionalProblemComponent,
  CompletarUnCuadradoProblemComponent,
  UnaIdentidadQueAcotaUnProductoProblemComponent,
  CoordenadasEnUnaBaseOblicuaProblemComponent,
  NucleoEImagenDeUnaAplicacionProblemComponent,
  DosVectoresOrtonormalesProblemComponent,
  UnAjusteConstantePorMinimosCuadradosProblemComponent,
  UnaMatrizQueDeshaceOtraProblemComponent,
] as const;
