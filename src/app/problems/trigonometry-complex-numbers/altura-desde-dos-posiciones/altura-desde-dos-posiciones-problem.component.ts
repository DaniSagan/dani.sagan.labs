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
      }
    ]
  };
}
