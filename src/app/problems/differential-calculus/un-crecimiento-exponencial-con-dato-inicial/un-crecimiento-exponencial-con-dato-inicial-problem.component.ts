import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-crecimiento-exponencial-con-dato-inicial-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-crecimiento-exponencial-con-dato-inicial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCrecimientoExponencialConDatoInicialProblemComponent {
  static readonly title = "Un crecimiento exponencial con dato inicial";
  static readonly route = 'problema-158';
  static readonly problem: PracticeProblem = {
  "id": "problema-158",
  "number": 158,
  "title": "Un crecimiento exponencial con dato inicial",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Repaso",
  "statement": "Una población idealizada satisface P′(t)=0,2P(t) y P(0)=500. Halla P(t) y el tiempo de duplicación.",
  "resources": [
    {
      "label": "Ecuaciones diferenciales de primer orden y enfriamiento",
      "route": "/articles/first-order-odes",
      "activity": "Practica un crecimiento exponencial con dato inicial. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
