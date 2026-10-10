import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-transformacion-de-mobius-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-transformacion-de-mobius-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaTransformacionDeMobiusProblemComponent {
  static readonly title = "Una transformación de Möbius";
  static readonly route = "problema-039";
  static readonly problem: PracticeProblem = {
    "id": "problema-039",
    "number": 39,
    "title": "Una transformación de Möbius",
    "category": "Trigonometría y números complejos",
    "topic": "Plano complejo",
    "level": "Reto",
    "statement": "Para \\(z=iy\\), y real, estudia \\(w=(z-1)/(z+1)\\). Demuestra que \\(\\lvert w\\rvert =1\\) y determina qué punto de la circunferencia no aparece.",
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
