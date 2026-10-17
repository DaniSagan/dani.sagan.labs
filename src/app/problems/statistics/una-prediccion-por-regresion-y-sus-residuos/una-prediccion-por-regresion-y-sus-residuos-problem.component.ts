import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-prediccion-por-regresion-y-sus-residuos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-prediccion-por-regresion-y-sus-residuos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaPrediccionPorRegresionYSusResiduosProblemComponent {
  static readonly title = "Una predicción por regresión y sus residuos";
  static readonly route = 'problema-186';
  static readonly problem: PracticeProblem = {
  "id": "problema-186",
  "number": 186,
  "title": "Una predicción por regresión y sus residuos",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Para (0,1), (1,2), (2,2), encuentra la recta de mínimos cuadrados y predice el valor en x=3.",
  "resources": [
    {
      "label": "Regresión lineal y correlación de Pearson",
      "route": "/articles/linear-regression",
      "activity": "Practica una predicción por regresión y sus residuos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
