import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-area-entre-dos-curvas-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './area-entre-dos-curvas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AreaEntreDosCurvasProblemComponent {
  static readonly title = "Área entre dos curvas";
  static readonly route = "area-between-curves";
  static readonly problem: PracticeProblem = {
  "id": "problema-066",
  "route": "area-between-curves",
  "number": 66,
  "title": "Área entre dos curvas",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Calcula el área encerrada entre \\(y=x\\) e \\(y=x^{2}\\).",
  "resources": [
    {
      "label": "Áreas entre curvas y sólidos de revolución",
      "route": "/articles/areas-revolution",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Parábola",
      "route": "/articles/parabola",
      "activity": "Propiedades geométricas de la curva que aparece en el cálculo del ejercicio."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Tablas de signos e inecuaciones",
      "route": "/articles/sign-charts",
      "activity": "Separa ceros y puntos excluidos antes de decidir dónde se cumple una desigualdad."
    },
    {
      "label": "Ecuaciones cuadráticas",
      "route": "/articles/quadratic-equations",
      "activity": "Resuelve la ecuación de segundo grado y distingue los casos degenerados."
    }
  ]
};
}
