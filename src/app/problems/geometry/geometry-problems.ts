import { UnaAlturaPorSemejanzaProblemComponent } from './una-altura-por-semejanza/una-altura-por-semejanza-problem.component';
import { ElRadioDeUnTrianguloRectanguloProblemComponent } from './el-radio-de-un-triangulo-rectangulo/el-radio-de-un-triangulo-rectangulo-problem.component';
import { UnHexagonoAPartirDeSuApotemaProblemComponent } from './un-hexagono-a-partir-de-su-apotema/un-hexagono-a-partir-de-su-apotema-problem.component';
import { EscalarLongitudesAreasYVolumenesProblemComponent } from './escalar-longitudes-areas-y-volumenes/escalar-longitudes-areas-y-volumenes-problem.component';
import { ElCentroDeMasasDeTresPuntosProblemComponent } from './el-centro-de-masas-de-tres-puntos/el-centro-de-masas-de-tres-puntos-problem.component';
import { UnaEsferaInscritaEnUnCuboProblemComponent } from './una-esfera-inscrita-en-un-cubo/una-esfera-inscrita-en-un-cubo-problem.component';
import { UnaNormalAPartirDeDosDireccionesProblemComponent } from './una-normal-a-partir-de-dos-direcciones/una-normal-a-partir-de-dos-direcciones-problem.component';
import { UnaSeccionTriangularDeUnCuboProblemComponent } from './una-seccion-triangular-de-un-cubo/una-seccion-triangular-de-un-cubo-problem.component';
import { ContarAristasDeUnOctaedroProblemComponent } from './contar-aristas-de-un-octaedro/contar-aristas-de-un-octaedro-problem.component';
import { UnaTangenteDesdeUnPuntoExteriorProblemComponent } from './una-tangente-desde-un-punto-exterior/una-tangente-desde-un-punto-exterior-problem.component';
import { TrianguloDeLadosEnterosProblemComponent } from './triangulo-de-lados-enteros/triangulo-de-lados-enteros-problem.component';
import { UnaMedianaMedidaProblemComponent } from './una-mediana-medida/una-mediana-medida-problem.component';
import { ConcurrenciaPorCevaProblemComponent } from './concurrencia-por-ceva/concurrencia-por-ceva-problem.component';
import { PotenciaDeUnPuntoProblemComponent } from './potencia-de-un-punto/potencia-de-un-punto-problem.component';
import { AreaEnUnaCuadriculaProblemComponent } from './area-en-una-cuadricula/area-en-una-cuadricula-problem.component';
import { RectaYCircunferenciaProblemComponent } from './recta-y-circunferencia/recta-y-circunferencia-problem.component';
import { UnaHiperbolaTrasladadaProblemComponent } from './una-hiperbola-trasladada/una-hiperbola-trasladada-problem.component';
import { DistanciaAUnPlanoProblemComponent } from './distancia-a-un-plano/distancia-a-un-plano-problem.component';
import { DosRectasQueSeCruzanProblemComponent } from './dos-rectas-que-se-cruzan/dos-rectas-que-se-cruzan-problem.component';
import { VolumenDeUnTetraedroProblemComponent } from './volumen-de-un-tetraedro/volumen-de-un-tetraedro-problem.component';

export const GEOMETRY_PROBLEMS = [
  TrianguloDeLadosEnterosProblemComponent,
  UnaMedianaMedidaProblemComponent,
  ConcurrenciaPorCevaProblemComponent,
  PotenciaDeUnPuntoProblemComponent,
  AreaEnUnaCuadriculaProblemComponent,
  RectaYCircunferenciaProblemComponent,
  UnaHiperbolaTrasladadaProblemComponent,
  DistanciaAUnPlanoProblemComponent,
  DosRectasQueSeCruzanProblemComponent,
  VolumenDeUnTetraedroProblemComponent,
  UnaAlturaPorSemejanzaProblemComponent,
  ElRadioDeUnTrianguloRectanguloProblemComponent,
  UnHexagonoAPartirDeSuApotemaProblemComponent,
  EscalarLongitudesAreasYVolumenesProblemComponent,
  ElCentroDeMasasDeTresPuntosProblemComponent,
  UnaEsferaInscritaEnUnCuboProblemComponent,
  UnaNormalAPartirDeDosDireccionesProblemComponent,
  UnaSeccionTriangularDeUnCuboProblemComponent,
  ContarAristasDeUnOctaedroProblemComponent,
  UnaTangenteDesdeUnPuntoExteriorProblemComponent,
] as const;
