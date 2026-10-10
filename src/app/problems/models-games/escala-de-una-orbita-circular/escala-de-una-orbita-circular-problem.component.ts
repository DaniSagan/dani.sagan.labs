import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-escala-de-una-orbita-circular-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './escala-de-una-orbita-circular-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EscalaDeUnaOrbitaCircularProblemComponent {
  static readonly title = "Escala de una órbita circular";
  static readonly route = "problema-097";
  static readonly problem: PracticeProblem = {
    "id": "problema-097",
    "number": 97,
    "title": "Escala de una órbita circular",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Reto",
    "statement": "En el modelo newtoniano de masa central M fija y satélite despreciable, deduce el período de una órbita circular de radio r. ¿Cómo cambia al duplicar r?",
    "resources": [
      {
        "label": "Péndulo doble",
        "route": "/articles/double-pendulum",
        "activity": "Otra aplicación de las leyes de Newton a un sistema dinámico; permite comparar modelos físicos con distintas hipótesis."
      },
      {
        "label": "Gravedad",
        "route": "/games/gravity",
        "activity": "Explora cualitativamente cómo cambia una órbita al modificar la distancia; contrasta con el ejercicio «Escala de una órbita circular»."
      }
    ]
  };
}
