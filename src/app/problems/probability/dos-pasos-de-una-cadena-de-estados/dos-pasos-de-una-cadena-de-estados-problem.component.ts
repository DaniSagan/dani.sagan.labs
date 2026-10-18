import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-pasos-de-una-cadena-de-estados-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-pasos-de-una-cadena-de-estados-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosPasosDeUnaCadenaDeEstadosProblemComponent {
  static readonly title = "Dos pasos de una cadena de estados";
  static readonly route = "two-step-state-transition";
  static readonly problem: PracticeProblem = {
  "id": "problema-180",
  "route": "two-step-state-transition",
  "number": 180,
  "title": "Dos pasos de una cadena de estados",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Repaso",
  "statement": "Un sistema está en A o B. Desde A permanece en A con probabilidad 0,8; desde B pasa a A con probabilidad 0,3. Si empieza en A, calcula la probabilidad de estar en A tras dos pasos.",
  "resources": [
    {
      "label": "Las cadenas de Markov",
      "route": "/articles/markov-chains",
      "activity": "Practica dos pasos de una cadena de estados. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Árboles de probabilidad y experimentos por etapas",
      "route": "/articles/probability-trees",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Grafos desde cero: grados, caminos y conectividad",
      "route": "/articles/graph-foundations",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices o vectores del enunciado y contrasta productos, rangos y determinantes."
    }
  ]
};
}
