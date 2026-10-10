import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-angulo-triple-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './angulo-triple-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AnguloTripleProblemComponent {
  static readonly title = "Ángulo triple";
  static readonly route = "problema-033";
  static readonly problem: PracticeProblem = {
    "id": "problema-033",
    "number": 33,
    "title": "Ángulo triple",
    "category": "Trigonometría y números complejos",
    "topic": "Identidades y ecuaciones",
    "level": "Oposición",
    "statement": "Resuelve \\(\\cos(3x)=\\cos x\\) para \\(0\\le x<2\\pi\\).",
    "resources": [
      {
        "label": "Ángulos múltiples y ángulo mitad",
        "route": "/articles/trig-n-functions",
        "activity": "Identidades trigonométricas que relacionan ángulos y permiten reducir ecuaciones."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      }
    ]
  };
}
