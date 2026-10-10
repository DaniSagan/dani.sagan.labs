import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-suma-de-raices-de-la-unidad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './suma-de-raices-de-la-unidad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class SumaDeRaicesDeLaUnidadProblemComponent {
  static readonly title = "Suma de raíces de la unidad";
  static readonly route = "problema-040";
  static readonly problem: PracticeProblem = {
    "id": "problema-040",
    "number": 40,
    "title": "Suma de raíces de la unidad",
    "category": "Trigonometría y números complejos",
    "topic": "Plano complejo",
    "level": "Oposición",
    "statement": "Sean \\(\\zeta =e^{\\frac{2\\pi i}{5}}\\) y \\(S=1+\\zeta +\\zeta ^{2}+\\zeta ^{3}+\\zeta ^{4}\\). Calcula S y deduce la suma de los cosenos de sus argumentos.",
    "resources": [
      {
        "label": "Polinomios ciclotómicos",
        "route": "/articles/cyclotomic-polynomials",
        "activity": "Factorizaciones de potencias menos uno y raíces de la unidad en el plano complejo."
      },
      {
        "label": "Identidad de Euler",
        "route": "/articles/euler-identity",
        "activity": "La conexión entre forma polar, exponencial compleja, seno y coseno."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      }
    ]
  };
}
