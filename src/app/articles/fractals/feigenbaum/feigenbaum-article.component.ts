import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { FeigenbaumExplorerComponent } from '../../../widgets/feigenbaum/feigenbaum-explorer.component';
import { FeigenbaumConvergenceComponent } from '../../../widgets/feigenbaum/feigenbaum-convergence.component';

@Component({
  selector: 'app-feigenbaum-article', standalone: true,
  imports: [RouterModule, FormulaComponent, FeigenbaumExplorerComponent, FeigenbaumConvergenceComponent],
  templateUrl: './feigenbaum-article.component.html', styleUrl: './feigenbaum-article.component.css'
})
export class FeigenbaumArticleComponent {
  static title = 'La constante de Feigenbaum';
  static route = 'feigenbaum';
}
