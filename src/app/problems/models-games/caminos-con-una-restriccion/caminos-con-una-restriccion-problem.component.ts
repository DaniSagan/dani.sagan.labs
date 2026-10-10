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
  static readonly route = "problema-091";
  static readonly problem: PracticeProblem = {
    "id": "problema-091",
    "number": 91,
    "title": "Caminos con una restricción",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Conteo, grafos y estrategias",
    "level": "Oposición",
    "statement": "Cuenta los caminos de \\((0,0)\\) a \\((4,4)\\) con pasos \\((1,0)\\) o \\((0,1)\\). ¿Cuántos no pasan nunca por encima de \\(y=x\\)?",
    "resources": [
      {
        "label": "Números de Catalan",
        "route": "/articles/catalan-numbers",
        "activity": "Recuentos de caminos sujetos a una restricción y otras interpretaciones combinatorias."
      }
    ]
  };
}
