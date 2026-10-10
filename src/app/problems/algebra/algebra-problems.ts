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
] as const;
