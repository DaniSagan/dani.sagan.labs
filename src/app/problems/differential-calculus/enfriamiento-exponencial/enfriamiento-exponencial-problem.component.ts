import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-enfriamiento-exponencial-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './enfriamiento-exponencial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EnfriamientoExponencialProblemComponent {
  static readonly title = "Enfriamiento exponencial";
  static readonly route = "problema-059";
  static readonly problem: PracticeProblem = {
    "id": "problema-059",
    "number": 59,
    "title": "Enfriamiento exponencial",
    "category": "Cálculo diferencial y optimización",
    "topic": "Optimización y modelos",
    "level": "Oposición",
    "statement": "Una bebida pasa de 90 °C a 60 °C en 10 minutos, en una habitación a 20 °C. Con \\(T'=-k(T-20)\\), halla \\(T(t)\\) y cuándo alcanza 40 °C.",
    "resources": [
      {
        "label": "Integración clásica",
        "route": "/articles/integration-classical",
        "activity": "La integración de dU/U=−k dt es el paso que produce la ley exponencial de enfriamiento."
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
      }
    ]
  };
}
