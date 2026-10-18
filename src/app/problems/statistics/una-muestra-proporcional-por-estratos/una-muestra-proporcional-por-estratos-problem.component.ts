import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-muestra-proporcional-por-estratos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-muestra-proporcional-por-estratos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaMuestraProporcionalPorEstratosProblemComponent {
  static readonly title = "Una muestra proporcional por estratos";
  static readonly route = "proportional-stratified-sampling";
  static readonly problem: PracticeProblem = {
  "id": "problema-188",
  "route": "proportional-stratified-sampling",
  "number": 188,
  "title": "Una muestra proporcional por estratos",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Oposición",
  "statement": "Una población tiene tres grupos de 600, 300 y 100 personas. Distribuye una muestra de tamaño 80 proporcionalmente y explica cómo seleccionarla.",
  "resources": [
    {
      "label": "Muestreo estratificado y estimadores ponderados",
      "route": "/articles/stratified-sampling",
      "activity": "Practica una muestra proporcional por estratos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Principios de conteo y combinaciones",
      "route": "/articles/counting-principles",
      "activity": "Decide si importa el orden y si se permite repetir antes de usar una fórmula."
    },
    {
      "label": "Sesgo de selección y representatividad",
      "route": "/articles/sampling-bias",
      "activity": "Un tamaño grande no corrige una selección que excluye parte de la población."
    }
  ]
};
}
