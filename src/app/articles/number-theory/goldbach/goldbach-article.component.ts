import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { GoldbachPairsComponent } from '../../../widgets/goldbach/goldbach-pairs.component';
import { GoldbachCometComponent } from '../../../widgets/goldbach/goldbach-comet.component';
import { GoldbachSieveComponent } from '../../../widgets/goldbach/goldbach-sieve.component';

@Component({
  selector: 'app-goldbach-article',
  standalone: true,
  imports: [
    FormulaComponent,
    GoldbachPairsComponent,
    GoldbachCometComponent,
    GoldbachSieveComponent,
  ],
  templateUrl: './goldbach-article.component.html',
  styles: [
    ':host{display:block;min-width:0}app-formula{display:block;max-width:100%;overflow-x:auto;margin:1rem 0}',
  ],
})
export class GoldbachArticleComponent {
  static title = 'La conjetura de Goldbach';
  static route = 'goldbach';
}
