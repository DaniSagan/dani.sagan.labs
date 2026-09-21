import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { DoublePendulumLabComponent } from '../../../widgets/double-pendulum/double-pendulum-lab.component';
import { DoublePendulumModesComponent } from '../../../widgets/double-pendulum/double-pendulum-modes.component';
import { DoublePendulumSectionComponent } from '../../../widgets/double-pendulum/double-pendulum-section.component';

@Component({
  selector: 'app-double-pendulum-article', standalone: true,
  imports: [FormulaComponent, DoublePendulumLabComponent, DoublePendulumModesComponent, DoublePendulumSectionComponent],
  templateUrl: './double-pendulum-article.component.html',
  styles: [':host { display: block; min-width: 0; } app-formula { display: block; max-width: 100%; overflow-x: auto; margin: 1rem 0; }']
})
export class DoublePendulumArticleComponent {
  static title = 'El péndulo doble: del orden al caos';
  static route = 'double-pendulum';
}
