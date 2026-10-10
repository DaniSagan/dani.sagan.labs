import { DosDadosYUnaCondicionProblemComponent } from './dos-dados-y-una-condicion/dos-dados-y-una-condicion-problem.component';
import { ExtraccionSinReemplazoProblemComponent } from './extraccion-sin-reemplazo/extraccion-sin-reemplazo-problem.component';
import { BayesYTasaBaseProblemComponent } from './bayes-y-tasa-base/bayes-y-tasa-base-problem.component';
import { IndependenciaDeSucesosProblemComponent } from './independencia-de-sucesos/independencia-de-sucesos-problem.component';
import { CambiarDePuertaProblemComponent } from './cambiar-de-puerta/cambiar-de-puerta-problem.component';
import { UnaDistribucionBinomialProblemComponent } from './una-distribucion-binomial/una-distribucion-binomial-problem.component';
import { TiempoHastaElPrimerExitoProblemComponent } from './tiempo-hasta-el-primer-exito/tiempo-hasta-el-primer-exito-problem.component';
import { NormalizarUnaDensidadProblemComponent } from './normalizar-una-densidad/normalizar-una-densidad-problem.component';
import { EsperanzaYPremioJustoProblemComponent } from './esperanza-y-premio-justo/esperanza-y-premio-justo-problem.component';
import { UnaCadenaDeMarkovProblemComponent } from './una-cadena-de-markov/una-cadena-de-markov-problem.component';

export const PROBABILITY_PROBLEMS = [
  DosDadosYUnaCondicionProblemComponent,
  ExtraccionSinReemplazoProblemComponent,
  BayesYTasaBaseProblemComponent,
  IndependenciaDeSucesosProblemComponent,
  CambiarDePuertaProblemComponent,
  UnaDistribucionBinomialProblemComponent,
  TiempoHastaElPrimerExitoProblemComponent,
  NormalizarUnaDensidadProblemComponent,
  EsperanzaYPremioJustoProblemComponent,
  UnaCadenaDeMarkovProblemComponent,
] as const;
