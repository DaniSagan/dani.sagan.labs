import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-recurrencia-afin-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './recurrencia-afin-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RecurrenciaAfinProblemComponent {
  static readonly title = "Recurrencia afín";
  static readonly route = "affine-recurrence";
  static readonly problem: PracticeProblem = {
  "id": "problema-043",
  "route": "affine-recurrence",
  "number": 43,
  "title": "Recurrencia afín",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Oposición",
  "statement": "Resuelve \\(a_{0}=5\\), \\(a_{n+1}=\\frac{a_n+6}3\\) y calcula su límite.",
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
      "label": "Teorema central del límite",
      "route": "/articles/central-limit-theorem",
      "activity": "La recurrencia de este problema es determinista. Como ampliación, el artículo muestra procesos probabilísticos en los que también se estudian estados estacionarios y límites."
    },
    {
      "label": "Inducción matemática y construcción de pruebas",
      "route": "/articles/mathematical-induction",
      "activity": "Demuestra la identidad o la estructura de todas las etapas, separando caso inicial y paso inductivo."
    },
    {
      "label": "Progresiones y series geométricas",
      "route": "/articles/geometric-series",
      "activity": "Reconoce la razón multiplicativa y distingue suma finita, límite y resto geométrico."
    },
    {
      "label": "Teorema del punto fijo de Banach",
      "route": "/articles/banach-fixed-point",
      "activity": "Amplía el análisis de iteraciones con conservación del dominio, contracción y cotas de error."
    }
  ]
};
}
