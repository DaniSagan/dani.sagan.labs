import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-aproximacion-cuadratica-con-cota-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-aproximacion-cuadratica-con-cota-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaAproximacionCuadraticaConCotaProblemComponent {
  static readonly title = "Una aproximación cuadrática con cota";
  static readonly route = 'problema-159';
  static readonly problem: PracticeProblem = {
  "id": "problema-159",
  "number": 159,
  "title": "Una aproximación cuadrática con cota",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Aproxima e^0,1 con su Taylor de grado dos en cero y acota el error usando e^0,1<1,11.",
  "resources": [
    {
      "label": "Series de Taylor",
      "route": "/articles/taylor-series",
      "activity": "Practica una aproximación cuadrática con cota. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
