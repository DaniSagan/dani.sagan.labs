import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-normalizar-una-densidad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './normalizar-una-densidad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class NormalizarUnaDensidadProblemComponent {
  static readonly title = "Normalizar una densidad";
  static readonly route = "normalizing-a-density";
  static readonly problem: PracticeProblem = {
  "id": "problema-078",
  "route": "normalizing-a-density",
  "number": 78,
  "title": "Normalizar una densidad",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Oposición",
  "statement": "Sea \\(f(x)=cx\\) para \\(0\\le x\\le 2\\) y \\(f(x)=0\\) fuera. Halla c, \\(P(X\\le 1)\\), \\(E(X)\\) y \\(\\operatorname{Var}(X)\\).",
  "resources": [
    {
      "label": "Densidad, esperanza y varianza",
      "route": "/articles/continuous-random-variables",
      "activity": "Normaliza la densidad, calcula áreas y momentos, y observa cómo los cambios de escala transforman media y varianza."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Función de Cantor y distribuciones singulares",
      "route": "/articles/cantor-function",
      "activity": "Amplía la noción de distribución continua con una acumulada singular concentrada en Cantor."
    },
    {
      "label": "Distribución acumulada y colas",
      "route": "/articles/distribution-functions-tails",
      "activity": "Relaciona áreas acumuladas, probabilidades de intervalos y complementos."
    },
    {
      "label": "Transformaciones de medias y varianzas",
      "route": "/articles/moment-transformations",
      "activity": "El desplazamiento afecta a la media y la escala entra al cuadrado en la varianza."
    }
  ]
};
}
