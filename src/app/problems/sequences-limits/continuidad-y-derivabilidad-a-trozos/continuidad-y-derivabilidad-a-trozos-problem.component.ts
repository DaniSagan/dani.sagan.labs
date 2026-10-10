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
  static readonly route = "problema-048";
  static readonly problem: PracticeProblem = {
    "id": "problema-048",
    "number": 48,
    "title": "Continuidad y derivabilidad a trozos",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Límites y continuidad",
    "level": "Oposición",
    "statement": "Sea \\(f(x)=ax+b\\) si \\(x\\le 1\\) y \\(f(x)=x^{2}\\) si \\(x>1\\). Halla \\(a,b\\) para que sea derivable en \\(x=1\\).",
    "resources": [
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "Los desarrollos locales ayudan a distinguir el valor de una función y su pendiente; compara esas dos condiciones con la unión de las ramas del ejercicio."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
