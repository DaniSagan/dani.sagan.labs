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
  static readonly route = "triple-angle-identity";
  static readonly problem: PracticeProblem = {
  "id": "problema-033",
  "route": "triple-angle-identity",
  "number": 33,
  "title": "Ángulo triple",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Oposición",
  "statement": "Resuelve \\(\\cos(3x)=\\cos x\\) para \\(0\\le x<2\\pi\\).",
  "resources": [
    {
      "label": "Ecuaciones trigonométricas y periodicidad",
      "route": "/articles/trigonometric-equations",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Ángulos múltiples y ángulo mitad",
      "route": "/articles/trig-n-functions",
      "activity": "Identidades trigonométricas que relacionan ángulos y permiten reducir ecuaciones."
    },
    {
      "label": "Raíces, factores y multiplicidad",
      "route": "/articles/polynomial-foundations",
      "fragment": "roots",
      "activity": "Distingue raíces distintas de raíces contadas con multiplicidad y usa el producto nulo."
    },
    {
      "label": "Radianes y longitud de arco",
      "route": "/articles/radians",
      "activity": "Convierte grados a radianes antes de aplicar longitud = radio por ángulo."
    }
  ]
};
}
