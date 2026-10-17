import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-por-que-cambia-el-divisor-muestral-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './por-que-cambia-el-divisor-muestral-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PorQueCambiaElDivisorMuestralProblemComponent {
  static readonly title = "Por qué cambia el divisor muestral";
  static readonly route = 'problema-183';
  static readonly problem: PracticeProblem = {
  "id": "problema-183",
  "number": 183,
  "title": "Por qué cambia el divisor muestral",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Para la muestra 2, 4, 6 calcula la media, la varianza con divisor n y la varianza muestral corregida.",
  "resources": [
    {
      "label": "Corrección de Bessel y estimadores insesgados",
      "route": "/articles/bessel-correction",
      "activity": "Practica por qué cambia el divisor muestral. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
