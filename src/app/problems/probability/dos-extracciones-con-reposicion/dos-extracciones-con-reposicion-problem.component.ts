import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-extracciones-con-reposicion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-extracciones-con-reposicion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosExtraccionesConReposicionProblemComponent {
  static readonly title = "Dos extracciones con reposición";
  static readonly route = 'problema-171';
  static readonly problem: PracticeProblem = {
  "id": "problema-171",
  "number": 171,
  "title": "Dos extracciones con reposición",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Una urna contiene 3 bolas rojas y 2 azules. Se extraen dos bolas, devolviendo la primera antes de extraer la segunda. Calcula la probabilidad de obtener colores distintos.",
  "resources": [
    {
      "label": "Probabilidad en espacios finitos: sucesos y regla de Laplace",
      "route": "/articles/finite-probability",
      "activity": "Practica dos extracciones con reposición. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
