import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-racionalizacion-y-limite-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './racionalizacion-y-limite-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RacionalizacionYLimiteProblemComponent {
  static readonly title = "Racionalización y límite";
  static readonly route = "problema-047";
  static readonly problem: PracticeProblem = {
    "id": "problema-047",
    "number": 47,
    "title": "Racionalización y límite",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Límites y continuidad",
    "level": "Repaso",
    "statement": "Calcula \\(\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}\\) e indica el dominio real cerca de cero.",
    "resources": [
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "El desarrollo √(1+x)=1+x/2+O(x²) ofrece una comprobación alternativa del límite calculado aquí por racionalización."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
