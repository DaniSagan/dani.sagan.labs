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
  static readonly route = "skew-lines-distance";
  static readonly problem: PracticeProblem = {
  "id": "problema-029",
  "route": "skew-lines-distance",
  "number": 29,
  "title": "Dos rectas que se cruzan",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Reto",
  "statement": "Sean \\(r=(t,0,0)\\) y \\(s=(0,1,1)+u(0,1,0)\\). Demuestra que son alabeadas y calcula su distancia.",
  "resources": [
    {
      "label": "Rectas y planos en el espacio: posiciones relativas",
      "route": "/articles/lines-planes",
      "activity": "Clasifica las posiciones mediante productos y rango; verifica que la proyección pertenece al plano y que el segmento mínimo es perpendicular."
    },
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
      "label": "Productos internos y ortonormalización de Gram–Schmidt",
      "route": "/articles/gram-schmidt",
      "activity": "Construye direcciones ortogonales y conecta sus componentes con productos internos."
    },
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
    },
    {
      "label": "Producto vectorial",
      "route": "/articles/cross-product",
      "activity": "Construye una dirección perpendicular a dos vectores independientes."
    },
    {
      "label": "Norma y distancia euclídea",
      "route": "/articles/vector-norm",
      "activity": "Distingue un vector de su longitud y calcula distancias."
    }
  ]
};
}
