import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-euclids-lemma',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './euclids-lemma.component.html',
  styleUrl: './euclids-lemma.component.css'
})
export class EuclidsLemmaComponent {
  static title = 'Lema de Euclides'; static route = 'euclids-lemma';
}
