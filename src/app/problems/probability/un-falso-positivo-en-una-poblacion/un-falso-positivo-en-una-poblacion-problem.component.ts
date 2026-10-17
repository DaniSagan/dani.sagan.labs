import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-falso-positivo-en-una-poblacion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-falso-positivo-en-una-poblacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnFalsoPositivoEnUnaPoblacionProblemComponent {
  static readonly title = "Un falso positivo en una población";
  static readonly route = 'problema-172';
  static readonly problem: PracticeProblem = {
  "id": "problema-172",
  "number": 172,
  "title": "Un falso positivo en una población",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Una condición aparece en el 2% de una población. Una prueba detecta el 90% de los casos y da positivo en el 5% de quienes no la tienen. Calcula la probabilidad de tener la condición dado un positivo.",
  "resources": [
    {
      "label": "Teorema de Bayes",
      "route": "/articles/bayes-theorem",
      "activity": "Practica un falso positivo en una población. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
