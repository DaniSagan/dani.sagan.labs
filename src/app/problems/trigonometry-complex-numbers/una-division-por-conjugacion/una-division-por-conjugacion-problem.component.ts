import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-division-por-conjugacion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-division-por-conjugacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDivisionPorConjugacionProblemComponent {
  static readonly title = "Una división por conjugación";
  static readonly route = 'problema-137';
  static readonly problem: PracticeProblem = {
  "id": "problema-137",
  "number": 137,
  "title": "Una división por conjugación",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Expresa (3+i)/(1−i) en la forma a+bi.",
  "resources": [
    {
      "label": "Fórmula de De Moivre: potencias y raíces complejas",
      "route": "/articles/de-moivre",
      "activity": "Practica una división por conjugación. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
