import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integral-trigonometrica-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integral-trigonometrica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegralTrigonometricaProblemComponent {
  static readonly title = "Una integral trigonométrica";
  static readonly route = "trigonometric-integral";
  static readonly problem: PracticeProblem = {
  "id": "problema-064",
  "route": "trigonometric-integral",
  "number": 64,
  "title": "Una integral trigonométrica",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Oposición",
  "statement": "Calcula \\(\\int_0^{\\pi/2}\\sin^3x\\,dx\\).",
  "resources": [
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Razones e identidades trigonométricas",
      "route": "/articles/trig-n-functions",
      "activity": "Relaciona ángulos y coordenadas y justifica las identidades utilizadas."
    }
  ]
};
}
