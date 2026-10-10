import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-triangulo-con-angulo-conocido-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-triangulo-con-angulo-conocido-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnTrianguloConAnguloConocidoProblemComponent {
  static readonly title = "Un triángulo con ángulo conocido";
  static readonly route = "problema-035";
  static readonly problem: PracticeProblem = {
    "id": "problema-035",
    "number": 35,
    "title": "Un triángulo con ángulo conocido",
    "category": "Trigonometría y números complejos",
    "topic": "Identidades y ecuaciones",
    "level": "Repaso",
    "statement": "Dos lados de un triángulo miden 5 y 7 y forman 60°. Calcula el tercer lado y el área.",
    "resources": [
      {
        "label": "Teorema del coseno",
        "route": "/articles/law-of-cosines",
        "activity": "La relación entre dos lados, el ángulo comprendido y el tercer lado."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Dibuja sin(x) y cos(2*x) para localizar las soluciones del ejercicio «Una ecuación trigonométrica» antes de justificarlas."
      }
    ]
  };
}
