import { CaminosConUnaRestriccionProblemComponent } from './caminos-con-una-restriccion/caminos-con-una-restriccion-problem.component';
import { UnRecorridoEulerianoProblemComponent } from './un-recorrido-euleriano/un-recorrido-euleriano-problem.component';
import { LineasGanadorasEnDosJuegosProblemComponent } from './lineas-ganadoras-en-dos-juegos/lineas-ganadoras-en-dos-juegos-problem.component';
import { UnaSimetriaDelSudokuProblemComponent } from './una-simetria-del-sudoku/una-simetria-del-sudoku-problem.component';
import { OrdenDeUnGiroDelCuboProblemComponent } from './orden-de-un-giro-del-cubo/orden-de-un-giro-del-cubo-problem.component';
import { UnOsciladorCelularProblemComponent } from './un-oscilador-celular/un-oscilador-celular-problem.component';
import { EscalaDeUnaOrbitaCircularProblemComponent } from './escala-de-una-orbita-circular/escala-de-una-orbita-circular-problem.component';
import { AlturaSolarEnOviedoProblemComponent } from './altura-solar-en-oviedo/altura-solar-en-oviedo-problem.component';
import { ViajeEntreHusosFijosProblemComponent } from './viaje-entre-husos-fijos/viaje-entre-husos-fijos-problem.component';
import { LongitudYDimensionDeCantorProblemComponent } from './longitud-y-dimension-de-cantor/longitud-y-dimension-de-cantor-problem.component';

export const MODELS_GAMES_PROBLEMS = [
  CaminosConUnaRestriccionProblemComponent,
  UnRecorridoEulerianoProblemComponent,
  LineasGanadorasEnDosJuegosProblemComponent,
  UnaSimetriaDelSudokuProblemComponent,
  OrdenDeUnGiroDelCuboProblemComponent,
  UnOsciladorCelularProblemComponent,
  EscalaDeUnaOrbitaCircularProblemComponent,
  AlturaSolarEnOviedoProblemComponent,
  ViajeEntreHusosFijosProblemComponent,
  LongitudYDimensionDeCantorProblemComponent,
] as const;
