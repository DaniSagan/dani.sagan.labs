import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-longitud-de-una-curva-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './longitud-de-una-curva-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LongitudDeUnaCurvaProblemComponent {
  static readonly title = "Longitud de una curva";
  static readonly route = "curve-arc-length";
  static readonly problem: PracticeProblem = {
  "id": "problema-068",
  "route": "curve-arc-length",
  "number": 68,
  "title": "Longitud de una curva",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Reto",
  "statement": "Calcula la longitud del arco \\(y=(\\frac{2}{3})x^{\\frac{3}{2}}\\) para \\(0\\le x\\le 3\\).",
  "resources": [
    {
      "label": "Longitud de arco y parametrización de curvas",
      "route": "/articles/arc-length",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    }
  ]
};
}
