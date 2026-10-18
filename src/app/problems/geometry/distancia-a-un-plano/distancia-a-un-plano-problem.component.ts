import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-distancia-a-un-plano-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './distancia-a-un-plano-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DistanciaAUnPlanoProblemComponent {
  static readonly title = "Distancia a un plano";
  static readonly route = "point-plane-distance";
  static readonly problem: PracticeProblem = {
  "id": "problema-028",
  "route": "point-plane-distance",
  "number": 28,
  "title": "Distancia a un plano",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Oposición",
  "statement": "Calcula la distancia de \\(P=(1,2,3)\\) al plano \\(2x-y+2z-4=0\\) y su proyección ortogonal.",
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
      "activity": "Propiedades algebraicas y significado geométrico de los determinantes."
    },
    {
      "label": "Productos internos y ortonormalización de Gram–Schmidt",
      "route": "/articles/gram-schmidt",
      "activity": "Construye direcciones ortogonales y conecta sus componentes con productos internos."
    },
    {
      "label": "Proyecciones ortogonales y mínimos cuadrados",
      "route": "/articles/projection-least-squares",
      "activity": "Deduce la proyección mediante ortogonalidad del residuo y relaciónala con un ajuste de mínimos cuadrados."
    },
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
    },
    {
      "label": "Vectores normales a un plano",
      "route": "/articles/plane-normal",
      "activity": "Obtén una dirección perpendicular al plano y úsala para proyectar."
    },
    {
      "label": "Producto escalar y perpendicularidad",
      "route": "/articles/dot-product",
      "activity": "Calcula productos escalares y comprueba ortogonalidad."
    },
    {
      "label": "Norma y distancia euclídea",
      "route": "/articles/vector-norm",
      "activity": "Distingue un vector de su longitud y calcula distancias."
    }
  ]
};
}
