import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-orden-de-un-giro-del-cubo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './orden-de-un-giro-del-cubo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class OrdenDeUnGiroDelCuboProblemComponent {
  static readonly title = "Orden de un giro del cubo";
  static readonly route = "problema-095";
  static readonly problem: PracticeProblem = {
    "id": "problema-095",
    "number": 95,
    "title": "Orden de un giro del cubo",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Conteo, grafos y estrategias",
    "level": "Oposición",
    "statement": "Modela un giro de 90° de una cara exterior del cubo de Rubik como permutación de pegatinas. Determina su orden y la inversa, sin confundirlo con un algoritmo de varias caras.",
    "resources": [
      {
        "label": "Polinomios ciclotómicos",
        "route": "/articles/cyclotomic-polynomials",
        "activity": "Un ciclo de cuatro posiciones tiene autovalores entre las raíces cuartas de la unidad. La lectura sobre polinomios ciclotómicos amplía esta conexión entre orden y raíces de la unidad."
      },
      {
        "label": "Cubo de Rubik",
        "route": "/games/rubik-cube",
        "activity": "Repite cuatro veces un mismo giro exterior para comprobar el orden del movimiento en el ejercicio «Orden de un giro del cubo»."
      }
    ]
  };
}
