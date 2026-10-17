import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-seno-inverso-fuera-de-su-rama-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-seno-inverso-fuera-de-su-rama-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnSenoInversoFueraDeSuRamaProblemComponent {
  static readonly title = "Un seno inverso fuera de su rama";
  static readonly route = 'problema-133';
  static readonly problem: PracticeProblem = {
  "id": "problema-133",
  "number": 133,
  "title": "Un seno inverso fuera de su rama",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Calcula arcsen(sen(5π/6)) y explica por qué no devuelve 5π/6.",
  "resources": [
    {
      "label": "Composición de funciones trigonométricas y sus inversas",
      "route": "/articles/trig-inverse-trig-composition",
      "activity": "Practica un seno inverso fuera de su rama. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
