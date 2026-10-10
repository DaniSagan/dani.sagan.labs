import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-serie-telescopica-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-serie-telescopica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSerieTelescopicaProblemComponent {
  static readonly title = "Una serie telescópica";
  static readonly route = "problema-044";
  static readonly problem: PracticeProblem = {
    "id": "problema-044",
    "number": 44,
    "title": "Una serie telescópica",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Sucesiones y series",
    "level": "Repaso",
    "statement": "Calcula \\(\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)}\\).",
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
