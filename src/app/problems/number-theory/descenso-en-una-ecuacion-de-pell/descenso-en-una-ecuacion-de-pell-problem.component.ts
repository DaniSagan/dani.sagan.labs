import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-descenso-en-una-ecuacion-de-pell-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './descenso-en-una-ecuacion-de-pell-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DescensoEnUnaEcuacionDePellProblemComponent {
  static readonly title = "Descenso en una ecuación de Pell";
  static readonly route = "problema-007";
  static readonly problem: PracticeProblem = {
    "id": "problema-007",
    "number": 7,
    "title": "Descenso en una ecuación de Pell",
    "category": "Aritmética y teoría de números",
    "topic": "Diofánticas y demostraciones",
    "level": "Reto",
    "statement": "Encuentra la menor solución entera con \\(x>0,y>0\\) de \\(x^{2}-2y^{2}=1\\) y obtén otra solución al cuadrar \\(x+y\\sqrt{2}\\).",
    "resources": [
      {
        "label": "Ecuación de Pell",
        "route": "/articles/pell-equation",
        "activity": "Soluciones enteras de ecuaciones cuadráticas y su conexión con irracionales cuadráticos."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
