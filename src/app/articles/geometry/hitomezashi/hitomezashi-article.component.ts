import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { HitomezashiLabComponent } from '../../../widgets/hitomezashi/hitomezashi-lab.component';
import {
  SelfAssessmentComponent,
  ExerciseDefinition,
} from '../../../widgets/self-assessment/self-assessment.component';

@Component({
  selector: 'app-hitomezashi-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    HitomezashiLabComponent,
    SelfAssessmentComponent,
  ],
  templateUrl: './hitomezashi-article.component.html',
  styleUrl: '../../number-theory/gcd-euclid/gcd-euclid-article.component.css',
})
export class HitomezashiArticleComponent {
  static title = 'Patrones Hitomezashi: bordar con bits';
  static route = 'hitomezashi';
  readonly exercises: readonly ExerciseDefinition[] = [
    {
      title: 'Una fila de puntadas',
      question:
        'En una fila de 7 celdas con bit 1, ¿cuántas puntadas horizontales hay?',
      answer: '3',
      hints: [
        'Los inicios se numeran desde 0.',
        'Enumera los inicios impares menores que 7.',
      ],
      solution:
        'Empiezan en 1, 3 y 5: hay tres segmentos. El inicio 7 queda fuera del dibujo. Con bit 0 habría cuatro: 0, 2, 4 y 6.',
    },
    {
      title: 'Cambiar sin añadir',
      question:
        'En una cuadrícula de 20 × 20 celdas se invierte un único bit. ¿Cuánto cambia el número total de segmentos?',
      answer: '0',
      hints: [
        'Cada línea tiene veinte posiciones posibles.',
        'Compara cuántas posiciones pares e impares hay.',
      ],
      solution:
        'No cambia: hay diez posiciones de cada paridad. Se retiran diez segmentos y aparecen otros diez. Las regiones, en cambio, sí pueden cambiar.',
    },
    {
      title: 'El giro obligatorio',
      question:
        'Justifica que una trayectoria no puede seguir recta al pasar por un vértice interior.',
      hints: [
        'Mira los dos segmentos horizontales que podrían llegar al vértice.',
        'Sus inicios tienen distinta paridad. Repite el argumento en vertical.',
      ],
      solution:
        'Exactamente uno de los dos horizontales está presente y exactamente uno de los verticales. Hay dos aristas incidentes, una de cada orientación: al continuar la trayectoria se gira un ángulo recto.',
    },
    {
      title: 'Una simetría que puedes fabricar',
      question:
        '¿Por qué elegir la misma secuencia para filas y columnas garantiza simetría respecto a la diagonal?',
      hints: [
        'La reflexión intercambia (x,y) con (y,x).',
        'Una puntada horizontal pasa a ser vertical.',
      ],
      solution:
        'La puntada horizontal desde (x,y) existe cuando x tiene la paridad del bit de la fila y. Su reflejo es la vertical desde (y,x), cuya condición es la misma si el bit de la columna y coincide con el de la fila y. El argumento también funciona a la inversa.',
    },
  ];
}
