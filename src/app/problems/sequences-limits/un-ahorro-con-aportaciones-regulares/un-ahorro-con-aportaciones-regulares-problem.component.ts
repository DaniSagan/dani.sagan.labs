import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-ahorro-con-aportaciones-regulares-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-ahorro-con-aportaciones-regulares-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnAhorroConAportacionesRegularesProblemComponent {
  static readonly title = "Un ahorro con aportaciones regulares";
  static readonly route = "savings-with-regular-deposits";
  static readonly problem: PracticeProblem = {
  "id": "problema-144",
  "route": "savings-with-regular-deposits",
  "number": 144,
  "title": "Un ahorro con aportaciones regulares",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Una cuenta empieza con 100 euros. Cada mes se multiplica el saldo por 1,01 y después se ingresan 20 euros. Obtén el saldo tras n meses.",
  "resources": [
    {
      "label": "Sucesiones recurrentes y puntos fijos",
      "route": "/articles/recurrent-sequences",
      "activity": "Practica un ahorro con aportaciones regulares. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Progresiones y series geométricas",
      "route": "/articles/geometric-series",
      "activity": "Distingue suma finita, serie infinita y condición sobre la razón."
    },
    {
      "label": "Exponenciales y logaritmos",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio y utiliza las funciones inversas para despejar."
    }
  ]
};
}
