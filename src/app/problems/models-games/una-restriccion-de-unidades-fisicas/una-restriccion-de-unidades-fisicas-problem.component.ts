import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-restriccion-de-unidades-fisicas-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-restriccion-de-unidades-fisicas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRestriccionDeUnidadesFisicasProblemComponent {
  static readonly title = "Una restricción de unidades físicas";
  static readonly route = "physical-units-constraint";
  static readonly problem: PracticeProblem = {
  "id": "problema-199",
  "route": "physical-units-constraint",
  "number": 199,
  "title": "Una restricción de unidades físicas",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Dinámica y aplicaciones",
  "level": "Repaso",
  "statement": "Suponiendo que el período T depende solo de una longitud L y una aceleración g como T=C Lᵃgᵇ, determina los exponentes y qué queda sin saber.",
  "resources": [
    {
      "label": "Análisis dimensional y leyes de escala",
      "route": "/articles/dimensional-analysis",
      "activity": "Practica una restricción de unidades físicas. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Eliminación de Gauss y sistemas compatibles",
      "route": "/articles/gaussian-elimination",
      "activity": "Entiende qué operaciones conservan las soluciones de un sistema."
    }
  ]
};
}
