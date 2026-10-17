import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-divisores-que-son-cubos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './divisores-que-son-cubos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DivisoresQueSonCubosProblemComponent {
  static readonly title = "Divisores que son cubos";
  static readonly route = 'problema-104';
  static readonly problem: PracticeProblem = {
  "id": "problema-104",
  "number": 104,
  "title": "Divisores que son cubos",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Repaso",
  "statement": "Calcula cuántos divisores positivos de 3600 son cubos perfectos y enuméralos.",
  "resources": [
    {
      "label": "Fórmulas para divisores y suma de divisores",
      "route": "/articles/divisor-sum-theorem",
      "activity": "Practica divisores que son cubos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
