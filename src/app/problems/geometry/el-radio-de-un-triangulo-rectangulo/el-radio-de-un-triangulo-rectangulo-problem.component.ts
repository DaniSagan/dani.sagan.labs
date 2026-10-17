import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-radio-de-un-triangulo-rectangulo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-radio-de-un-triangulo-rectangulo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElRadioDeUnTrianguloRectanguloProblemComponent {
  static readonly title = "El radio de un triángulo rectángulo";
  static readonly route = 'problema-122';
  static readonly problem: PracticeProblem = {
  "id": "problema-122",
  "number": 122,
  "title": "El radio de un triángulo rectángulo",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Calcula el inradio y el circunradio de un triángulo rectángulo con catetos 6 y 8.",
  "resources": [
    {
      "label": "Circunferencias inscritas y circunscritas",
      "route": "/articles/incircles-circumcircles",
      "activity": "Practica el radio de un triángulo rectángulo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
