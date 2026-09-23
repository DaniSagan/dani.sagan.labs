import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { MarkovLabComponent } from '../../../widgets/markov/markov-lab.component';
import { MarkovMixingComponent } from '../../../widgets/markov/markov-mixing.component';
import { MarkovAbsorptionComponent } from '../../../widgets/markov/markov-absorption.component';
@Component({
  selector: 'app-markov-chains-article',
  standalone: true,
  imports: [
    FormulaComponent,
    MarkovLabComponent,
    MarkovMixingComponent,
    MarkovAbsorptionComponent,
  ],
  templateUrl: './markov-chains-article.component.html',
  styleUrl: './markov-chains-article.component.css',
})
export class MarkovChainsArticleComponent {
  static title = 'Las cadenas de Markov';
  static route = 'markov-chains';
}
