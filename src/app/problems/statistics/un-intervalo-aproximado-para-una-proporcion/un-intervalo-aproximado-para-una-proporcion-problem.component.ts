import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-intervalo-aproximado-para-una-proporcion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-intervalo-aproximado-para-una-proporcion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnIntervaloAproximadoParaUnaProporcionProblemComponent {
  static readonly title = "Un intervalo aproximado para una proporción";
  static readonly route = 'problema-189';
  static readonly problem: PracticeProblem = {
  "id": "problema-189",
  "number": 189,
  "title": "Un intervalo aproximado para una proporción",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Repaso",
  "statement": "En una muestra aleatoria de 400 respuestas independientes, 240 son favorables. Construye el intervalo normal aproximado del 95% usando 1,96 y comenta su interpretación.",
  "resources": [
    {
      "label": "Intervalos para proporciones: Wilson y métodos exactos",
      "route": "/articles/proportion-intervals",
      "activity": "Practica un intervalo aproximado para una proporción. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
