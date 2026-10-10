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
  static readonly route = "problema-031";
  static readonly problem: PracticeProblem = {
    "id": "problema-031",
    "number": 31,
    "title": "Una ecuación trigonométrica",
    "category": "Trigonometría y números complejos",
    "topic": "Identidades y ecuaciones",
    "level": "Repaso",
    "statement": "Resuelve \\(\\sin x=\\cos(2x)\\) para \\(0\\le x<2\\pi\\).",
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
