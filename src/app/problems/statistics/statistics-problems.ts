import { MediaYVarianzaDescriptivaProblemComponent } from './media-y-varianza-descriptiva/media-y-varianza-descriptiva-problem.component';
import { TransformacionDeMedidasProblemComponent } from './transformacion-de-medidas/transformacion-de-medidas-problem.component';
import { UnaRectaDeRegresionProblemComponent } from './una-recta-de-regresion/una-recta-de-regresion-problem.component';
import { UnaParadojaDeAgregacionProblemComponent } from './una-paradoja-de-agregacion/una-paradoja-de-agregacion-problem.component';
import { ResumenesIgualesGraficosDistintosProblemComponent } from './resumenes-iguales-graficos-distintos/resumenes-iguales-graficos-distintos-problem.component';
import { PrecisionDeUnaMediaProblemComponent } from './precision-de-una-media/precision-de-una-media-problem.component';
import { IntervaloParaUnaMediaNormalProblemComponent } from './intervalo-para-una-media-normal/intervalo-para-una-media-normal-problem.component';
import { ContrasteBilateralProblemComponent } from './contraste-bilateral/contraste-bilateral-problem.component';
import { TamanoMuestralParaUnaProporcionProblemComponent } from './tamano-muestral-para-una-proporcion/tamano-muestral-para-una-proporcion-problem.component';
import { SesgoDeSeleccionProblemComponent } from './sesgo-de-seleccion/sesgo-de-seleccion-problem.component';

export const STATISTICS_PROBLEMS = [
  MediaYVarianzaDescriptivaProblemComponent,
  TransformacionDeMedidasProblemComponent,
  UnaRectaDeRegresionProblemComponent,
  UnaParadojaDeAgregacionProblemComponent,
  ResumenesIgualesGraficosDistintosProblemComponent,
  PrecisionDeUnaMediaProblemComponent,
  IntervaloParaUnaMediaNormalProblemComponent,
  ContrasteBilateralProblemComponent,
  TamanoMuestralParaUnaProporcionProblemComponent,
  SesgoDeSeleccionProblemComponent,
] as const;
