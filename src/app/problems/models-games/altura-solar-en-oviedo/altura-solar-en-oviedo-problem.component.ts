import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-altura-solar-en-oviedo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './altura-solar-en-oviedo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AlturaSolarEnOviedoProblemComponent {
  static readonly title = "Altura solar en Oviedo";
  static readonly route = "problema-098";
  static readonly problem: PracticeProblem = {
    "id": "problema-098",
    "number": 98,
    "title": "Altura solar en Oviedo",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Oposición",
    "statement": "En un modelo ideal sin refracción, Oviedo tiene latitud \\(\\varphi =43,36\\)° N. Calcula la altura del Sol al mediodía solar para declinaciones \\(\\delta =0\\)°\\(, +23,44\\)° \\(y -23,44\\)°.",
    "resources": [
      {
        "label": "Geometría solar: latitud, declinación y altura",
        "route": "/articles/solar-geometry",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Ángulos múltiples y ángulo mitad",
        "route": "/articles/trig-n-functions",
        "activity": "La altura y la distancia al cénit son ángulos complementarios. El artículo repasa las identidades trigonométricas que permiten relacionar seno y coseno de esos ángulos."
      },
      {
        "label": "Posición del Sol",
        "route": "/tools/sun-position",
        "activity": "Consulta latitud 43,36° N en torno a los equinoccios y compara la altura con el modelo ideal del ejercicio «Altura solar en Oviedo»."
      },
      {
        "label": "Trigonometría esférica y coordenadas celestes",
        "route": "/articles/spherical-trigonometry",
        "activity": "Amplía la geometría solar con coordenadas sobre una esfera y conversión de altura y azimut."
      },
      {
        "label": "Ecuación del tiempo y mediodía solar",
        "route": "/articles/equation-of-time",
        "activity": "Separa tiempo solar aparente, tiempo medio, longitud geográfica y desfase civil."
      },
      {
        "label": "Análisis dimensional y leyes de escala",
        "route": "/articles/dimensional-analysis",
        "activity": "Comprueba unidades y leyes de escala antes de interpretar transformaciones geométricas o físicas."
      }
    ]
  };
}
