import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-orbitas-de-un-campo-vectorial-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './orbitas-de-un-campo-vectorial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class OrbitasDeUnCampoVectorialProblemComponent {
  static readonly title = "Órbitas de un campo vectorial";
  static readonly route = "problema-060";
  static readonly problem: PracticeProblem = {
    "id": "problema-060",
    "number": 60,
    "title": "Órbitas de un campo vectorial",
    "category": "Cálculo diferencial y optimización",
    "topic": "Optimización y modelos",
    "level": "Reto",
    "statement": "Para el sistema \\(x'=-y\\), \\(y'=x\\), con \\((x(0),y(0))=(2,0)\\), halla la trayectoria, el sentido y el período.",
    "resources": [
      {
        "label": "Integrales primeras y cantidades conservadas",
        "route": "/articles/first-integrals",
        "activity": "Deriva la cantidad conservada a lo largo del campo y distingue su conservación exacta de la deriva de un integrador numérico."
      },
      {
        "label": "Sistemas diferenciales lineales y exponencial de matrices",
        "route": "/articles/linear-ode-systems",
        "activity": "Conecta autovectores y Jordan con el flujo continuo; deriva la exponencial de la matriz y verifica el dato inicial."
      },
      {
        "label": "Oscilador armónico y retratos de fase",
        "route": "/articles/harmonic-oscillator",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Autómatas celulares",
        "route": "/articles/cellular-automata",
        "activity": "Este ejercicio usa un sistema diferencial continuo. El artículo permite contrastarlo con la evolución por pasos discretos de un autómata."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa x*exp(-x) para verificar la forma global descrita en el ejercicio «Estudio global de una función»."
      },
      {
        "label": "Campo vectorial",
        "route": "/tools/vector-field",
        "activity": "Explora el campo (−y,x) del ejercicio «Órbitas de un campo vectorial» y observa las trayectorias circulares."
      },
      {
        "label": "Integración numérica de ecuaciones diferenciales",
        "route": "/articles/ode-numerical-integration",
        "activity": "Contrasta Euler, Heun y RK4 con soluciones conocidas antes de aplicar un integrador a la dinámica."
      }
    ]
  };
}
