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
] as const;
