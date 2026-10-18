import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-proyeccion-ortogonal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './proyeccion-ortogonal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ProyeccionOrtogonalProblemComponent {
  static readonly title = "Proyección ortogonal";
  static readonly route = "orthogonal-projection";
  static readonly problem: PracticeProblem = {
  "id": "problema-019",
  "route": "orthogonal-projection",
  "number": 19,
  "title": "Proyección ortogonal",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Oposición",
  "statement": "Proyecta \\(v=(2,1,3)\\) sobre el plano \\(x+y+z=0\\) y calcula la distancia de v al plano.",
  "resources": [
    {
      "label": "Rectas y planos en el espacio: posiciones relativas",
      "route": "/articles/lines-planes",
      "activity": "Clasifica las posiciones mediante productos y rango; verifica que la proyección pertenece al plano y que el segmento mínimo es perpendicular."
    },
    {
      "label": "Proyecciones ortogonales y distancias en el espacio",
      "route": "/articles/orthogonal-projections",
      "activity": "Calcula el pie de la perpendicular y las distancias a planos o entre rectas, y verifica la ortogonalidad del residuo."
    },
    {
      "label": "Determinantes",
      "route": "/articles/matrix-determinant",
      "activity": "La condición de ortogonalidad usada en la proyección está vinculada con la geometría vectorial; el artículo de determinantes ofrece otro enfoque para medir independencia y volumen."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
    },
    {
      "label": "Espacios vectoriales, bases y rango–nulidad",
      "route": "/articles/vector-spaces",
      "activity": "Interpreta rango, imagen y núcleo para clasificar transformaciones y conjuntos de soluciones."
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
