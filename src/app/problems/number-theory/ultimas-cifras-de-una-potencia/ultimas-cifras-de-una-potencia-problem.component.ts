import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-ultimas-cifras-de-una-potencia-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './ultimas-cifras-de-una-potencia-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UltimasCifrasDeUnaPotenciaProblemComponent {
  static readonly title = "Últimas cifras de una potencia";
  static readonly route = "last-digits-of-a-power";
  static readonly problem: PracticeProblem = {
  "id": "problema-004",
  "route": "last-digits-of-a-power",
  "number": 4,
  "title": "Últimas cifras de una potencia",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Oposición",
  "statement": "Calcula las dos últimas cifras de \\(7^{2026}\\) sin calcular la potencia completa.",
  "resources": [
    {
      "label": "Orden multiplicativo",
      "route": "/articles/orders-theorem",
      "activity": "El papel de los ciclos de potencias al reducir exponentes en aritmética modular."
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
