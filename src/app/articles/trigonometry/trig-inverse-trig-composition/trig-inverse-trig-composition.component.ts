import { Component } from '@angular/core';
import { MathjaxModule } from 'mathjax-angular';

@Component({
  selector: 'app-trig-inverse-trig-composition',
  standalone: true,
  imports: [MathjaxModule],
  templateUrl: './trig-inverse-trig-composition.component.html',
  styleUrl: './trig-inverse-trig-composition.component.css'
})
export class TrigInverseTrigCompositionComponent {
  static title: string = 'Composición de funciones trigonométricas y sus inversas';
  static route: string = 'trig-inverse-trig-composition';

  sinArcsin: string = '$$ \\sin{\\left(\\arcsin{x}\\right)} = x $$';
  cosArccos: string = '$$ \\cos{\\left(\\arccos{x}\\right)} = x $$';
  tgArctg: string = '$$ \\tan{\\left(\\arctan{x}\\right)} = x $$';

  sinArccos: string = '$$ \\sin{\\left(\\arccos{x}\\right)} = \\sqrt{1 - x^2} $$';
  cosArcsin: string = '$$ \\cos{\\left(\\arcsin{x}\\right)} = \\sqrt{1 - x^2} $$';

  sinArctg: string = '$$ \\sin{\\left(\\arctan{x}\\right)} = \\frac{x}{\\sqrt{1+x^2}} $$';
  cosArctg: string = '$$ \\cos{\\left(\\arctan{x}\\right)} = \\frac{1}{\\sqrt{1+x^2}} $$';
  tgArcsin: string = '$$ \\tan{\\left(\\arcsin{x}\\right)} = \\frac{x}{\\sqrt{1-x^2}} $$';
  tgArccos: string = '$$ \\tan{\\left(\\arccos{x}\\right)} = \\frac{\\sqrt{1-x^2}}{x} $$';
}
