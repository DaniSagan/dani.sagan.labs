import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-raices-cuartas-de-1-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './raices-cuartas-de-1-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RaicesCuartasDe1ProblemComponent {
  static readonly title = "Raíces cuartas de −1";
  static readonly route = "problema-036";
  static readonly problem: PracticeProblem = {
    "id": "problema-036",
    "number": 36,
    "title": "Raíces cuartas de −1",
    "category": "Trigonometría y números complejos",
    "topic": "Plano complejo",
    "level": "Oposición",
    "statement": "Resuelve \\(z^{4}=-1\\) en los complejos y sitúa las raíces en el plano.",
    "resources": [
      {
        "label": "Identidad de Euler",
        "route": "/articles/euler-identity",
        "activity": "La conexión entre forma polar, exponencial compleja, seno y coseno."
      },
      {
        "label": "Polinomios ciclotómicos",
        "route": "/articles/cyclotomic-polynomials",
        "activity": "Factorizaciones de potencias menos uno y raíces de la unidad en el plano complejo."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      }
    ]
  };
}
