import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-funcion-con-esquina-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-funcion-con-esquina-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaFuncionConEsquinaProblemComponent {
  static readonly title = "Una función con esquina";
  static readonly route = 'problema-160';
  static readonly problem: PracticeProblem = {
  "id": "problema-160",
  "number": 160,
  "title": "Una función con esquina",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Estudia la continuidad y derivabilidad en cero de f(x)=|x|.",
  "resources": [
    {
      "label": "Continuidad y derivabilidad: funciones a trozos",
      "route": "/articles/continuity-differentiability",
      "activity": "Practica una función con esquina. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
