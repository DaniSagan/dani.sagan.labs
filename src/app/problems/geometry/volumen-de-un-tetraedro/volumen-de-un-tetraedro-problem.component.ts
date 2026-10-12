import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-volumen-de-un-tetraedro-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './volumen-de-un-tetraedro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class VolumenDeUnTetraedroProblemComponent {
  static readonly title = "Volumen de un tetraedro";
  static readonly route = "problema-030";
  static readonly problem: PracticeProblem = {
    "id": "problema-030",
    "number": 30,
    "title": "Volumen de un tetraedro",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Oposición",
    "statement": "Calcula el volumen del tetraedro con vértices \\(O=(0,0,0)\\), \\(A=(2,0,0)\\), \\(B=(0,3,0)\\), \\(C=(1,1,4)\\).",
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
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "Propiedades algebraicas y significado geométrico de los determinantes."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
