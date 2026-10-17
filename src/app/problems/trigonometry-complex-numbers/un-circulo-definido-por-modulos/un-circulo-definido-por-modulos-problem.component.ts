import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-circulo-definido-por-modulos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-circulo-definido-por-modulos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCirculoDefinidoPorModulosProblemComponent {
  static readonly title = "Un círculo definido por módulos";
  static readonly route = 'problema-140';
  static readonly problem: PracticeProblem = {
  "id": "problema-140",
  "number": 140,
  "title": "Un círculo definido por módulos",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Describe geométricamente los complejos z que cumplen |z−(2−i)|=3 y halla sus intersecciones con el eje real.",
  "resources": [
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Practica un círculo definido por módulos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
