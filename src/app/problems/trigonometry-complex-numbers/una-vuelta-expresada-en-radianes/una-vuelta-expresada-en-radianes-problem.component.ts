import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-vuelta-expresada-en-radianes-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-vuelta-expresada-en-radianes-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaVueltaExpresadaEnRadianesProblemComponent {
  static readonly title = "Una vuelta expresada en radianes";
  static readonly route = "full-turn-in-radians";
  static readonly problem: PracticeProblem = {
  "id": "problema-131",
  "route": "full-turn-in-radians",
  "number": 131,
  "title": "Una vuelta expresada en radianes",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Una rueda de radio 30 cm gira 150°. Calcula el ángulo en radianes y la longitud del arco recorrido por un punto del borde.",
  "resources": [
    {
      "label": "Radianes",
      "route": "/articles/radians",
      "activity": "Practica una vuelta expresada en radianes. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Razones e identidades trigonométricas",
      "route": "/articles/trig-n-functions",
      "activity": "Relaciona ángulos y coordenadas y justifica las identidades utilizadas."
    }
  ]
};
}
