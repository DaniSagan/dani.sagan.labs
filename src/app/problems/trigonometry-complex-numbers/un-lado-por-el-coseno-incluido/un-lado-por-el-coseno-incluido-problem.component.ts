import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-lado-por-el-coseno-incluido-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-lado-por-el-coseno-incluido-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLadoPorElCosenoIncluidoProblemComponent {
  static readonly title = "Un lado por el coseno incluido";
  static readonly route = "side-length-by-cosine-rule";
  static readonly problem: PracticeProblem = {
  "id": "problema-134",
  "route": "side-length-by-cosine-rule",
  "number": 134,
  "title": "Un lado por el coseno incluido",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Dos lados de un triángulo miden 5 y 7 y forman un ángulo de 60°. Halla el tercer lado y el área.",
  "resources": [
    {
      "label": "Ley de los cosenos",
      "route": "/articles/law-of-cosines",
      "activity": "Practica un lado por el coseno incluido. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Razones e identidades trigonométricas",
      "route": "/articles/trig-n-functions",
      "activity": "Relaciona ángulos y coordenadas y justifica las identidades utilizadas."
    },
    {
      "label": "Medianas, alturas, incentro y métricas del triángulo",
      "route": "/articles/triangle-metrics",
      "activity": "Distingue los segmentos y centros del triángulo y sus relaciones con el área."
    }
  ]
};
}
