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
  static readonly route = "complex-division-by-conjugation";
  static readonly problem: PracticeProblem = {
  "id": "problema-137",
  "route": "complex-division-by-conjugation",
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
    },
    {
      "label": "Aritmética compleja, módulo y conjugado",
      "route": "/articles/complex-arithmetic",
      "activity": "Calcula en forma binómica y usa el conjugado para dividir."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    }
  ]
};
}
