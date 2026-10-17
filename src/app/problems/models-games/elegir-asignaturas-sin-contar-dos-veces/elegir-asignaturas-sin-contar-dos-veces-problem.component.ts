import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-elegir-asignaturas-sin-contar-dos-veces-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './elegir-asignaturas-sin-contar-dos-veces-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElegirAsignaturasSinContarDosVecesProblemComponent {
  static readonly title = "Elegir asignaturas sin contar dos veces";
  static readonly route = 'problema-193';
  static readonly problem: PracticeProblem = {
  "id": "problema-193",
  "number": 193,
  "title": "Elegir asignaturas sin contar dos veces",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "De 60 estudiantes, 35 cursan álgebra, 28 geometría y 12 ambas. ¿Cuántos cursan al menos una y cuántos ninguna?",
  "resources": [
    {
      "label": "Principio de inclusión y exclusión",
      "route": "/articles/inclusion-exclusion",
      "activity": "Practica elegir asignaturas sin contar dos veces. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
