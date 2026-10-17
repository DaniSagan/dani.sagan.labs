import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-coeficiente-sin-expandir-todo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-coeficiente-sin-expandir-todo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCoeficienteSinExpandirTodoProblemComponent {
  static readonly title = "Un coeficiente sin expandir todo";
  static readonly route = 'problema-194';
  static readonly problem: PracticeProblem = {
  "id": "problema-194",
  "number": 194,
  "title": "Un coeficiente sin expandir todo",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Halla el coeficiente de x³ en (1+2x)⁵.",
  "resources": [
    {
      "label": "Teorema binomial",
      "route": "/articles/binomial-theorem",
      "activity": "Practica un coeficiente sin expandir todo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
