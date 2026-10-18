import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-potencia-enorme-modulo-siete-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-potencia-enorme-modulo-siete-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaPotenciaEnormeModuloSieteProblemComponent {
  static readonly title = "Una potencia enorme módulo siete";
  static readonly route = "large-power-modulo-seven";
  static readonly problem: PracticeProblem = {
  "id": "problema-105",
  "route": "large-power-modulo-seven",
  "number": 105,
  "title": "Una potencia enorme módulo siete",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Repaso",
  "statement": "Calcula el resto de 3²⁰²⁶ al dividir por 7 sin calcular la potencia completa.",
  "resources": [
    {
      "label": "Pequeño teorema de Fermat",
      "route": "/articles/fermats-little-theorem",
      "activity": "Practica una potencia enorme módulo siete. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    },
    {
      "label": "División euclídea y restos",
      "route": "/articles/division-algorithm",
      "activity": "Distingue cociente y resto, también para dividendos negativos."
    }
  ]
};
}
