import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-identidad-que-acota-un-producto-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-identidad-que-acota-un-producto-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIdentidadQueAcotaUnProductoProblemComponent {
  static readonly title = "Una identidad que acota un producto";
  static readonly route = "product-bound-by-algebraic-identity";
  static readonly problem: PracticeProblem = {
  "id": "problema-115",
  "route": "product-bound-by-algebraic-identity",
  "number": 115,
  "title": "Una identidad que acota un producto",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Si a y b son reales con a+b=10, demuestra que ab≤25 y determina cuándo hay igualdad.",
  "resources": [
    {
      "label": "Ecuaciones cuadráticas: discriminante y Viète",
      "route": "/articles/quadratic-equations",
      "activity": "Practica una identidad que acota un producto. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    },
    {
      "label": "Desigualdades entre medias",
      "route": "/articles/mean-inequalities",
      "activity": "Relaciona sumas y productos de números positivos."
    }
  ]
};
}
