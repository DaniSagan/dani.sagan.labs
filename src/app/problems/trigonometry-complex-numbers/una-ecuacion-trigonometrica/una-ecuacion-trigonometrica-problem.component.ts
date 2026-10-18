import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-ecuacion-trigonometrica-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-ecuacion-trigonometrica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaEcuacionTrigonometricaProblemComponent {
  static readonly title = "Una ecuación trigonométrica";
  static readonly route = "trigonometric-equation";
  static readonly problem: PracticeProblem = {
  "id": "problema-031",
  "route": "trigonometric-equation",
  "number": 31,
  "title": "Una ecuación trigonométrica",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Resuelve \\(\\sin x=\\cos(2x)\\) para \\(0\\le x<2\\pi\\).",
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
      "label": "Ecuaciones cuadráticas",
      "route": "/articles/quadratic-equations",
      "activity": "Resuelve la ecuación de segundo grado y distingue los casos degenerados."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    },
    {
      "label": "Radianes y longitud de arco",
      "route": "/articles/radians",
      "activity": "Convierte grados a radianes antes de aplicar longitud = radio por ángulo."
    }
  ]
};
}
