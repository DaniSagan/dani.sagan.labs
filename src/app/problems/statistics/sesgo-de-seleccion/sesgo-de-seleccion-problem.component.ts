import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-sesgo-de-seleccion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './sesgo-de-seleccion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class SesgoDeSeleccionProblemComponent {
  static readonly title = "Sesgo de selección";
  static readonly route = "problema-090";
  static readonly problem: PracticeProblem = {
    "id": "problema-090",
    "number": 90,
    "title": "Sesgo de selección",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Inferencia y muestreo",
    "level": "Oposición",
    "statement": "Para estimar las horas de estudio del alumnado de un instituto, se encuesta solo a quienes están en la biblioteca a las 18:00. ¿Aumentar a 1000 respuestas corrige el problema? Propón un diseño mejor.",
    "resources": [
      {
        "label": "Teorema de Bayes",
        "route": "/articles/bayes-theorem",
        "activity": "Seleccionar solo personas de la biblioteca introduce una condición sobre la población. La probabilidad condicionada ayuda a expresar por qué esa muestra puede diferir del conjunto del instituto."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
