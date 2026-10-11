import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-altura-desde-dos-posiciones-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './altura-desde-dos-posiciones-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AlturaDesdeDosPosicionesProblemComponent {
  static readonly title = "Altura desde dos posiciones";
  static readonly route = "problema-032";
  static readonly problem: PracticeProblem = {
    "id": "problema-032",
    "number": 32,
    "title": "Altura desde dos posiciones",
    "category": "Trigonometría y números complejos",
    "topic": "Identidades y ecuaciones",
    "level": "Oposición",
    "statement": "En terreno horizontal, la cima de una torre se ve con elevación 30°. Tras acercarse 20 m hacia su base, la elevación es 60°. Calcula su altura, despreciando la altura del observador.",
    "resources": [
      {
        "label": "Trigonometría para medir alturas y distancias",
        "route": "/articles/height-surveying",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Ángulos múltiples y ángulo mitad",
        "route": "/articles/trig-n-functions",
        "activity": "Identidades trigonométricas que relacionan ángulos y permiten reducir ecuaciones."
      },
      {
        "label": "Teorema de Tales",
        "route": "/articles/thales-theorem",
        "activity": "Semejanza y proporcionalidad de segmentos como base de medidas indirectas."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      },
      {
        "label": "Semejanza de triángulos y proporcionalidad",
        "route": "/articles/triangle-similarity",
        "activity": "Identifica triángulos correspondientes y deduce razones de longitud, área y medidas indirectas."
      },
      {
        "label": "Ley de los senos y caso ambiguo",
        "route": "/articles/sine-law",
        "activity": "Amplía la resolución triangular con la ley de los senos y comprueba todas las ramas del caso ambiguo."
      },
      {
        "label": "Diferenciales y aproximación lineal",
        "route": "/articles/linear-approximation",
        "activity": "Interpreta la derivada como cambio lineal y separa el incremento real del error de aproximación."
      }
    ]
  };
}
