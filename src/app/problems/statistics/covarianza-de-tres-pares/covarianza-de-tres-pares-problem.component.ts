import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-covarianza-de-tres-pares-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './covarianza-de-tres-pares-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CovarianzaDeTresParesProblemComponent {
  static readonly title = "Covarianza de tres pares";
  static readonly route = "covariance-of-three-pairs";
  static readonly problem: PracticeProblem = {
  "id": "problema-185",
  "route": "covariance-of-three-pairs",
  "number": 185,
  "title": "Covarianza de tres pares",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Para los pares (1,2), (2,4), (3,3), calcula la covarianza usando divisor 3 y explica su signo.",
  "resources": [
    {
      "label": "Covarianza, dependencia y varianza de una suma",
      "route": "/articles/covariance",
      "activity": "Practica covarianza de tres pares. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Media, mediana, varianza y desviación típica",
      "route": "/articles/descriptive-statistics",
      "activity": "Distingue posición de dispersión y especifica el divisor de la varianza."
    }
  ]
};
}
