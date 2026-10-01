import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import {
  evaluateKnuth,
  expansionTex,
  grahamDefinition,
  knuthTex,
} from './graham.math';

@Component({
  selector: 'app-graham-lab',
  standalone: true,
  imports: [FormsModule, FormulaComponent],
  templateUrl: './graham-lab.component.html',
  styleUrls: ['../modular/modular-widgets.css', './graham-widgets.css'],
})
export class GrahamLabComponent {
  step = 0;
  readonly lessons = [
    {
      title: 'Multiplicar',
      tex: '3\\times3\\times3=3^3=27',
      text: 'La potencia comprime tres factores iguales. El exponente cuenta factores, no sumandos.',
    },
    {
      title: 'Una flecha',
      tex: '3\\uparrow3=3^3=27',
      text: 'Una flecha es la exponenciación que ya conoces.',
    },
    {
      title: 'Dos flechas',
      tex: '3\\uparrow\\uparrow3=3^{(3^3)}=3^{27}=7\\,625\\,597\\,484\\,987',
      text: 'Tres copias del 3 en una torre. Se resuelve desde arriba: 3 elevado a (3 elevado a 3). (3³)³ = 19 683 es otra operación.',
    },
    {
      title: 'Tres flechas',
      tex: '3\\uparrow\\uparrow\\uparrow3=3\\uparrow\\uparrow(3\\uparrow\\uparrow3)',
      text: 'Ahora iteramos la tetración. El resultado interior, 7 625 597 484 987, pasa a ser la altura de una torre de treses.',
    },
    {
      title: 'Cuatro flechas',
      tex: '3\\uparrow\\uparrow\\uparrow\\uparrow3=3\\uparrow\\uparrow\\uparrow(3\\uparrow\\uparrow\\uparrow3)=g_1',
      text: 'Iteramos la operación de tres flechas. Añadir una flecha cambia la operación; los operandos siguen siendo 3 y 3.',
    },
  ];
  base = 3;
  arrows = 2;
  operand = 3;
  error = '';
  result = evaluateKnuth(3, 2, 3);
  expression = knuthTex(3, 2, 3);
  expansion = expansionTex(3, 2, 3);
  level = 1;
  readonly levels = Array.from({ length: 64 }, (_, i) => i + 1);
  scale = 0;
  readonly scales = [
    {
      title: 'Googol',
      tex: '10^{100}',
      text: 'Un 1 seguido de cien ceros: 101 cifras. La potencia evita escribirlas todas.',
    },
    {
      title: 'Googolplex',
      tex: '10^{(10^{100})}',
      text: 'Un 1 seguido de un googol de ceros. Todavía basta una potencia anidada.',
    },
    {
      title: 'Una torre mayor',
      tex: '3\\uparrow\\uparrow4=3^{(3^{(3^3)})}',
      text: 'Esta torre concreta supera al googolplex: su exponente es 3^7 625 597 484 987. La altura es solo cuatro.',
    },
    {
      title: 'Cambiar la operación',
      tex: '3\\uparrow\\uparrow\\uparrow3=3\\uparrow\\uparrow(7\\,625\\,597\\,484\\,987)',
      text: 'El número de niveles de la torre ya es enorme. Aplicar logaritmos en base 3 baja un nivel cada vez: no proporciona una escala visual manejable.',
    },
    {
      title: 'g₁',
      tex: 'g_1=3\\uparrow\\uparrow\\uparrow\\uparrow3',
      text: 'Cuatro flechas todavía se pueden escribir. Su resultado será la cantidad de flechas del siguiente paso.',
    },
    {
      title: 'g₂',
      tex: 'g_2=3\\uparrow^{g_1}3',
      text: 'La llave conceptual cambia: g₁ cuenta flechas, no la altura de una torre ni un exponente ordinario.',
    },
    {
      title: 'G',
      tex: 'g_1\\longrightarrow g_2\\longrightarrow\\cdots\\longrightarrow g_{64}=G',
      text: 'Llegamos al paso 64 mediante una definición recursiva. Estos paneles ordenan magnitudes; sus distancias no miden tamaños.',
    },
  ];
  get definition(): string {
    return grahamDefinition(this.level);
  }
  update(): void {
    try {
      this.result = evaluateKnuth(this.base, this.arrows, this.operand);
      this.expression = knuthTex(this.base, this.arrows, this.operand);
      this.expansion = expansionTex(this.base, this.arrows, this.operand);
      this.error = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  example(base: number, arrows: number, operand: number): void {
    this.base = base;
    this.arrows = arrows;
    this.operand = operand;
    this.update();
  }
}
