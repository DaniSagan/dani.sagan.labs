import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-divisibilidad-universal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-divisibilidad-universal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDivisibilidadUniversalProblemComponent {
  static readonly title = "Una divisibilidad universal";
  static readonly route = "universal-divisibility";
  static readonly problem: PracticeProblem = {
  "id": "problema-008",
  "route": "universal-divisibility",
  "number": 8,
  "title": "Una divisibilidad universal",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Oposición",
  "statement": "Demuestra que \\(n^{5}-n\\) es divisible entre 30 para todo entero n.",
  "resources": [
    {
      "label": "Pequeño teorema de Fermat",
      "route": "/articles/fermats-little-theorem",
      "activity": "La congruencia de potencias usada en la prueba de divisibilidad por un primo."
    },
    {
      "label": "Inducción matemática y construcción de pruebas",
      "route": "/articles/mathematical-induction",
      "activity": "Demuestra la identidad o la estructura de todas las etapas, separando caso inicial y paso inductivo."
    },
    {
      "label": "Factorización prima y divisores",
      "route": "/articles/fundamental-theorem-arithmetic",
      "activity": "Usa la unicidad de la factorización para contar divisores y demostrar imposibilidades."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    },
    {
      "label": "Contradicción, implicación y equivalencia",
      "route": "/articles/proof-strategies",
      "activity": "Separa una demostración para todos los casos de una comprobación particular."
    }
  ]
};
}
