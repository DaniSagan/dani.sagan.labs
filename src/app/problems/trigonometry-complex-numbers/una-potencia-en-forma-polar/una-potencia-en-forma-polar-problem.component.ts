import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-potencia-en-forma-polar-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-potencia-en-forma-polar-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaPotenciaEnFormaPolarProblemComponent {
  static readonly title = "Una potencia en forma polar";
  static readonly route = "problema-038";
  static readonly problem: PracticeProblem = {
    "id": "problema-038",
    "number": 38,
    "title": "Una potencia en forma polar",
    "category": "Trigonometría y números complejos",
    "topic": "Plano complejo",
    "level": "Repaso",
    "statement": "Calcula \\((1+i)^{12}\\) en forma binómica.",
    "resources": [
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
