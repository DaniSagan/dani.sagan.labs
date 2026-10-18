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
  static readonly route = "inverse-sine-principal-branch";
  static readonly problem: PracticeProblem = {
  "id": "problema-133",
  "route": "inverse-sine-principal-branch",
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
