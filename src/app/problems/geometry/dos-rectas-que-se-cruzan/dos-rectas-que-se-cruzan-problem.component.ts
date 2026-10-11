import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-rectas-que-se-cruzan-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-rectas-que-se-cruzan-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosRectasQueSeCruzanProblemComponent {
  static readonly title = "Dos rectas que se cruzan";
  static readonly route = "problema-029";
  static readonly problem: PracticeProblem = {
    "id": "problema-029",
    "number": 29,
    "title": "Dos rectas que se cruzan",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Reto",
    "statement": "Sean \\(r=(t,0,0)\\) y \\(s=(0,1,1)+u(0,1,0)\\). Demuestra que son alabeadas y calcula su distancia.",
    "resources": [
      {
        "label": "Producto vectorial y producto mixto",
        "route": "/articles/vector-products",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Proyecciones ortogonales y distancias en el espacio",
        "route": "/articles/orthogonal-projections",
        "activity": "Calcula el pie de la perpendicular y las distancias a planos o entre rectas, y verifica la ortogonalidad del residuo."
      },
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "El producto mixto permite comprobar coplanaridad de dos direcciones y un vector que una sus rectas. Es una aplicación geométrica de los determinantes."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      },
      {
        "label": "Productos internos y ortonormalización de Gram–Schmidt",
        "route": "/articles/gram-schmidt",
        "activity": "Construye direcciones ortogonales y conecta sus componentes con productos internos."
      },
      {
        "label": "Pitágoras y distancia euclídea",
        "route": "/articles/pythagorean-distance",
        "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
      }
    ]
  };
}
