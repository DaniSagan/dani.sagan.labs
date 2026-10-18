import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-sucesion-radical-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-sucesion-radical-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSucesionRadicalProblemComponent {
  static readonly title = "Una sucesión radical";
  static readonly route = "nested-radical-sequence";
  static readonly problem: PracticeProblem = {
  "id": "problema-041",
  "route": "nested-radical-sequence",
  "number": 41,
  "title": "Una sucesión radical",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Oposición",
  "statement": "Sea \\(a_{1}=1\\) y \\(a_{n+1}=\\sqrt{2+a_{n}}\\). Demuestra que converge y calcula su límite.",
  "resources": [
    {
      "label": "Sucesiones monótonas y acotadas",
      "route": "/articles/monotone-convergence",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Sucesiones recurrentes y puntos fijos",
      "route": "/articles/recurrent-sequences",
      "activity": "Distingue candidatos a límite de pruebas de convergencia mediante monotonía, acotación y contracciones."
    },
    {
      "label": "Problema de Basilea",
      "route": "/articles/basel",
      "activity": "Una lectura complementaria sobre sumas infinitas y la diferencia entre convergencia y cálculo de su valor."
    },
    {
      "label": "Inducción matemática y construcción de pruebas",
      "route": "/articles/mathematical-induction",
      "activity": "Demuestra la identidad o la estructura de todas las etapas, separando caso inicial y paso inductivo."
    },
    {
      "label": "Teorema del punto fijo de Banach",
      "route": "/articles/banach-fixed-point",
      "activity": "Amplía el análisis de iteraciones con conservación del dominio, contracción y cotas de error."
    },
    {
      "label": "Compactos, perfectos y totalmente desconectados",
      "route": "/articles/compact-perfect-disconnected",
      "activity": "Prueba compacidad, ausencia de puntos aislados y desconexión sin confundir etapas finitas con el límite."
    },
    {
      "label": "Continuidad y derivadas laterales",
      "route": "/articles/continuity-differentiability",
      "activity": "Separa el valor, el límite y la existencia de una derivada."
    }
  ]
};
}
