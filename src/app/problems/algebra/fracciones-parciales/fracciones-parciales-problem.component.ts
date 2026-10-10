import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-fracciones-parciales-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './fracciones-parciales-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class FraccionesParcialesProblemComponent {
  static readonly title = "Fracciones parciales";
  static readonly route = "problema-015";
  static readonly problem: PracticeProblem = {
    "id": "problema-015",
    "number": 15,
    "title": "Fracciones parciales",
    "category": "Álgebra y álgebra lineal",
    "topic": "Polinomios y desigualdades",
    "level": "Oposición",
    "statement": "Descompón \\(\\frac{3x+5}{(x+1)(x+2)}\\) en fracciones simples e indica su dominio.",
    "resources": [
      {
        "label": "Integración clásica",
        "route": "/articles/integration-classical",
        "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
