import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-normal-a-partir-de-dos-direcciones-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-normal-a-partir-de-dos-direcciones-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaNormalAPartirDeDosDireccionesProblemComponent {
  static readonly title = "Una normal a partir de dos direcciones";
  static readonly route = 'problema-127';
  static readonly problem: PracticeProblem = {
  "id": "problema-127",
  "number": 127,
  "title": "Una normal a partir de dos direcciones",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "El plano pasa por el origen y contiene u=(1,0,1) y v=(0,1,1). Encuentra una ecuación del plano.",
  "resources": [
    {
      "label": "Producto vectorial",
      "route": "/articles/cross-product",
      "activity": "Practica una normal a partir de dos direcciones. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
