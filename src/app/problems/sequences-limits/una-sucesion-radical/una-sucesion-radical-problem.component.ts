import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-sucesion-radical-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-sucesion-radical-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSucesionRadicalProblemComponent {
  static readonly title = "Una sucesión radical";
  static readonly route = "problema-041";
  static readonly problem: PracticeProblem = {
    "id": "problema-041",
    "number": 41,
    "title": "Una sucesión radical",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Sucesiones y series",
    "level": "Oposición",
    "statement": "Sea \\(a_{1}=1\\) y \\(a_{n+1}=\\sqrt{2+a_{n}}\\). Demuestra que converge y calcula su límite.",
    "resources": [
      {
        "label": "Problema de Basilea",
        "route": "/articles/basel",
        "activity": "Una lectura complementaria sobre sumas infinitas y la diferencia entre convergencia y cálculo de su valor."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
