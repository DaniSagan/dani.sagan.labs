import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-recurrencia-afin-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './recurrencia-afin-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RecurrenciaAfinProblemComponent {
  static readonly title = "Recurrencia afín";
  static readonly route = "problema-043";
  static readonly problem: PracticeProblem = {
    "id": "problema-043",
    "number": 43,
    "title": "Recurrencia afín",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Sucesiones y series",
    "level": "Oposición",
    "statement": "Resuelve \\(a_{0}=5\\), \\(a_{n+1}=\\frac{a_n+6}3\\) y calcula su límite.",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "La recurrencia de este problema es determinista. Como ampliación, el artículo muestra procesos probabilísticos en los que también se estudian estados estacionarios y límites."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
