import { DosExtraccionesConReposicionProblemComponent } from './dos-extracciones-con-reposicion/dos-extracciones-con-reposicion-problem.component';
import { UnFalsoPositivoEnUnaPoblacionProblemComponent } from './un-falso-positivo-en-una-poblacion/un-falso-positivo-en-una-poblacion-problem.component';
import { AlMenosUnSeisEnTresTiradasProblemComponent } from './al-menos-un-seis-en-tres-tiradas/al-menos-un-seis-en-tres-tiradas-problem.component';
import { ExactamenteDosAciertosEnCuatroIntentosProblemComponent } from './exactamente-dos-aciertos-en-cuatro-intentos/exactamente-dos-aciertos-en-cuatro-intentos-problem.component';
import { UnLoteConDosPiezasDefectuosasProblemComponent } from './un-lote-con-dos-piezas-defectuosas/un-lote-con-dos-piezas-defectuosas-problem.component';
import { EsperarHastaUnaPrimeraCaraProblemComponent } from './esperar-hasta-una-primera-cara/esperar-hasta-una-primera-cara-problem.component';
import { ElPremioEsperadoDeUnaRifaProblemComponent } from './el-premio-esperado-de-una-rifa/el-premio-esperado-de-una-rifa-problem.component';
import { UnaDensidadTriangularYSuMediaProblemComponent } from './una-densidad-triangular-y-su-media/una-densidad-triangular-y-su-media-problem.component';
import { EstandarizarUnaMedidaNormalProblemComponent } from './estandarizar-una-medida-normal/estandarizar-una-medida-normal-problem.component';
import { DosPasosDeUnaCadenaDeEstadosProblemComponent } from './dos-pasos-de-una-cadena-de-estados/dos-pasos-de-una-cadena-de-estados-problem.component';
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
  DosExtraccionesConReposicionProblemComponent,
  UnFalsoPositivoEnUnaPoblacionProblemComponent,
  AlMenosUnSeisEnTresTiradasProblemComponent,
  ExactamenteDosAciertosEnCuatroIntentosProblemComponent,
  UnLoteConDosPiezasDefectuosasProblemComponent,
  EsperarHastaUnaPrimeraCaraProblemComponent,
  ElPremioEsperadoDeUnaRifaProblemComponent,
  UnaDensidadTriangularYSuMediaProblemComponent,
  EstandarizarUnaMedidaNormalProblemComponent,
  DosPasosDeUnaCadenaDeEstadosProblemComponent,
] as const;
