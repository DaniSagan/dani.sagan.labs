import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-multiplicar-dos-numeros-imaginarios-compuestos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './multiplicar-dos-numeros-imaginarios-compuestos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class MultiplicarDosNumerosImaginariosCompuestosProblemComponent {
  static readonly title = "Multiplicar dos números imaginarios compuestos";
  static readonly route = 'problema-136';
  static readonly problem: PracticeProblem = {
  "id": "problema-136",
  "number": 136,
  "title": "Multiplicar dos números imaginarios compuestos",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Calcula (2+3i)(1−2i), su módulo y su conjugado.",
  "resources": [
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Practica multiplicar dos números imaginarios compuestos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
