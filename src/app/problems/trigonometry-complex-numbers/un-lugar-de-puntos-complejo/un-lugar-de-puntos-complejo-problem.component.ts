import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-lugar-de-puntos-complejo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-lugar-de-puntos-complejo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLugarDePuntosComplejoProblemComponent {
  static readonly title = "Un lugar de puntos complejo";
  static readonly route = "problema-037";
  static readonly problem: PracticeProblem = {
    "id": "problema-037",
    "number": 37,
    "title": "Un lugar de puntos complejo",
    "category": "Trigonometría y números complejos",
    "topic": "Plano complejo",
    "level": "Oposición",
    "statement": "Describe geométricamente los z que cumplen \\(\\lvert z-1\\rvert =2\\lvert z+1\\rvert\\) y da centro y radio.",
    "resources": [
      {
        "label": "Transformaciones de Möbius",
        "route": "/articles/mobius-transformations",
        "activity": "Transformaciones fraccionarias del plano complejo y sus imágenes geométricas."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      }
    ]
  };
}
