import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-comparar-dos-orbitas-por-su-escala-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './comparar-dos-orbitas-por-su-escala-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CompararDosOrbitasPorSuEscalaProblemComponent {
  static readonly title = "Comparar dos órbitas por su escala";
  static readonly route = "comparing-orbital-scales";
  static readonly problem: PracticeProblem = {
  "id": "problema-200",
  "route": "comparing-orbital-scales",
  "number": 200,
  "title": "Comparar dos órbitas por su escala",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Dinámica y aplicaciones",
  "level": "Repaso",
  "statement": "Dos satélites en órbitas circulares alrededor de la misma masa tienen radios r y 4r. Usando v²=GM/r y T=2πr/v, compara sus velocidades y períodos.",
  "resources": [
    {
      "label": "Análisis dimensional y leyes de escala",
      "route": "/articles/dimensional-analysis",
      "activity": "Practica comparar dos órbitas por su escala. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Órbitas de Kepler y leyes de escala",
      "route": "/articles/kepler-orbits",
      "activity": "Separa radio al centro, velocidad y período al cambiar la escala."
    },
    {
      "label": "Simulador de gravedad",
      "route": "/games/gravity",
      "activity": "Explora órbitas y distingue el modelo de masa central fija de una simulación de varios cuerpos."
    }
  ]
};
}
