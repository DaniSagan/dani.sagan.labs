import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-continuidad-y-derivabilidad-a-trozos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './continuidad-y-derivabilidad-a-trozos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ContinuidadYDerivabilidadATrozosProblemComponent {
  static readonly title = "Continuidad y derivabilidad a trozos";
  static readonly route = "piecewise-continuity-and-differentiability";
  static readonly problem: PracticeProblem = {
  "id": "problema-048",
  "route": "piecewise-continuity-and-differentiability",
  "number": 48,
  "title": "Continuidad y derivabilidad a trozos",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Oposición",
  "statement": "Sea \\(f(x)=ax+b\\) si \\(x\\le 1\\) y \\(f(x)=x^{2}\\) si \\(x>1\\). Halla \\(a,b\\) para que sea derivable en \\(x=1\\).",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Continuidad y derivabilidad",
      "route": "/articles/continuity-differentiability",
      "activity": "Compara límites laterales y cocientes incrementales; distingue continuidad, derivabilidad y continuidad de la derivada."
    },
    {
      "label": "Series de Taylor",
      "route": "/articles/taylor-series",
      "activity": "Los desarrollos locales ayudan a distinguir el valor de una función y su pendiente; compara esas dos condiciones con la unión de las ramas del ejercicio."
    },
    {
      "label": "Tangente y aproximación lineal",
      "route": "/articles/linear-approximation",
      "activity": "Construye la recta con el valor y la derivada en el punto de contacto."
    }
  ]
};
}
