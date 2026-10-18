import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-caminos-con-una-restriccion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './caminos-con-una-restriccion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CaminosConUnaRestriccionProblemComponent {
  static readonly title = "Caminos con una restricción";
  static readonly route = "constrained-lattice-paths";
  static readonly problem: PracticeProblem = {
  "id": "problema-091",
  "route": "constrained-lattice-paths",
  "number": 91,
  "title": "Caminos con una restricción",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Oposición",
  "statement": "Cuenta los caminos de \\((0,0)\\) a \\((4,4)\\) con pasos \\((1,0)\\) o \\((0,1)\\). ¿Cuántos no pasan nunca por encima de \\(y=x\\)?",
  "resources": [
    {
      "label": "Principio de reflexión y caminos restringidos",
      "route": "/articles/reflection-principle",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Conteo sistemático en tableros y cuadrículas",
      "route": "/articles/grid-counting",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Números de Catalan",
      "route": "/articles/catalan-numbers",
      "activity": "Recuentos de caminos sujetos a una restricción y otras interpretaciones combinatorias."
    },
    {
      "label": "Principios de conteo: suma, producto y elecciones",
      "route": "/articles/counting-principles",
      "activity": "Define si el orden importa y si se permite repetición antes de construir el espacio de elecciones."
    }
  ]
};
}
