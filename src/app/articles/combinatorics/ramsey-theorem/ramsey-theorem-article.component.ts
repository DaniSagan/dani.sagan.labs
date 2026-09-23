import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { RamseyExplorerComponent } from '../../../widgets/ramsey/ramsey-explorer.component';
import { RamseyProofComponent } from '../../../widgets/ramsey/ramsey-proof.component';
import { RamseyCensusComponent } from '../../../widgets/ramsey/ramsey-census.component';

@Component({
  selector: 'app-ramsey-theorem-article',
  standalone: true,
  imports: [
    FormulaComponent,
    RamseyExplorerComponent,
    RamseyProofComponent,
    RamseyCensusComponent,
  ],
  templateUrl: './ramsey-theorem-article.component.html',
  styleUrl: './ramsey-theorem-article.component.css',
})
export class RamseyTheoremArticleComponent {
  static title = 'El teorema de Ramsey: R(3,3) = 6';
  static route = 'ramsey-theorem';
}
