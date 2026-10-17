import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-velocidad-y-cambio-de-sentido-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './velocidad-y-cambio-de-sentido-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class VelocidadYCambioDeSentidoProblemComponent {
  static readonly title = "Velocidad y cambio de sentido";
  static readonly route = 'problema-155';
  static readonly problem: PracticeProblem = {
  "id": "problema-155",
  "number": 155,
  "title": "Velocidad y cambio de sentido",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "La posición de una partícula es s(t)=t³−6t²+9t metros para 0≤t≤4 segundos. Determina cuándo cambia de sentido.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Practica velocidad y cambio de sentido. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
