import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-ecuacion-de-coseno-doble-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-ecuacion-de-coseno-doble-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaEcuacionDeCosenoDobleProblemComponent {
  static readonly title = "Una ecuación de coseno doble";
  static readonly route = "double-angle-cosine-equation";
  static readonly problem: PracticeProblem = {
  "id": "problema-132",
  "route": "double-angle-cosine-equation",
  "number": 132,
  "title": "Una ecuación de coseno doble",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Resuelve cos(2x)=1/2 para 0≤x<2π.",
  "resources": [
    {
      "label": "Ecuaciones trigonométricas y periodicidad",
      "route": "/articles/trigonometric-equations",
      "activity": "Practica una ecuación de coseno doble. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Razones e identidades trigonométricas",
      "route": "/articles/trig-n-functions",
      "activity": "Relaciona ángulos y coordenadas y justifica las identidades utilizadas."
    },
    {
      "label": "Radianes y longitud de arco",
      "route": "/articles/radians",
      "activity": "Convierte grados a radianes antes de aplicar longitud = radio por ángulo."
    }
  ]
};
}
