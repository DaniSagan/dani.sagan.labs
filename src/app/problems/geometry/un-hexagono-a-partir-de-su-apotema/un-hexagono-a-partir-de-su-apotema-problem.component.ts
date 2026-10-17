import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-hexagono-a-partir-de-su-apotema-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-hexagono-a-partir-de-su-apotema-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnHexagonoAPartirDeSuApotemaProblemComponent {
  static readonly title = "Un hexágono a partir de su apotema";
  static readonly route = 'problema-123';
  static readonly problem: PracticeProblem = {
  "id": "problema-123",
  "number": 123,
  "title": "Un hexágono a partir de su apotema",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Un hexágono regular tiene apotema 3√3 cm. Calcula su lado, perímetro y área.",
  "resources": [
    {
      "label": "Apotema de un polígono regular",
      "route": "/articles/apothem",
      "activity": "Practica un hexágono a partir de su apotema. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
