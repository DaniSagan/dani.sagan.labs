import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integral-como-area-firmada-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integral-como-area-firmada-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegralComoAreaFirmadaProblemComponent {
  static readonly title = "Una integral como área firmada";
  static readonly route = 'problema-162';
  static readonly problem: PracticeProblem = {
  "id": "problema-162",
  "number": 162,
  "title": "Una integral como área firmada",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Calcula la integral de x−1 entre 0 y 3 y compárala con el área geométrica entre la recta y el eje horizontal.",
  "resources": [
    {
      "label": "Áreas entre curvas y sólidos de revolución",
      "route": "/articles/areas-revolution",
      "activity": "Practica una integral como área firmada. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
