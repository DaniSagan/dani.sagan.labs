import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-parentesis-que-nunca-quedan-sin-abrir-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './parentesis-que-nunca-quedan-sin-abrir-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ParentesisQueNuncaQuedanSinAbrirProblemComponent {
  static readonly title = "Paréntesis que nunca quedan sin abrir";
  static readonly route = 'problema-197';
  static readonly problem: PracticeProblem = {
  "id": "problema-197",
  "number": 197,
  "title": "Paréntesis que nunca quedan sin abrir",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Enumera las cadenas correctas de tres pares de paréntesis y explica por qué hay cinco.",
  "resources": [
    {
      "label": "Números de Catalan",
      "route": "/articles/catalan-numbers",
      "activity": "Practica paréntesis que nunca quedan sin abrir. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
