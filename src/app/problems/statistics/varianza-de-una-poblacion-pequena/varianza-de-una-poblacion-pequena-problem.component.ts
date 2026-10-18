import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-varianza-de-una-poblacion-pequena-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './varianza-de-una-poblacion-pequena-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class VarianzaDeUnaPoblacionPequenaProblemComponent {
  static readonly title = "Varianza de una población pequeña";
  static readonly route = "small-population-variance";
  static readonly problem: PracticeProblem = {
  "id": "problema-182",
  "route": "small-population-variance",
  "number": 182,
  "title": "Varianza de una población pequeña",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Los cuatro valores 1, 3, 5, 7 constituyen toda una población. Calcula su varianza y desviación típica.",
  "resources": [
    {
      "label": "Estadística descriptiva y valores atípicos",
      "route": "/articles/descriptive-statistics",
      "activity": "Practica varianza de una población pequeña. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    }
  ]
};
}
