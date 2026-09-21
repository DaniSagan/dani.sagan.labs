import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { SandpileExplorerComponent } from '../../../widgets/sandpile/sandpile-explorer.component';
import { SandpileAbelianComponent } from '../../../widgets/sandpile/sandpile-abelian.component';
import { SandpileAvalanchesComponent } from '../../../widgets/sandpile/sandpile-avalanches.component';

@Component({
  selector: 'app-sandpile-article', standalone: true,
  imports: [FormulaComponent, SandpileExplorerComponent, SandpileAbelianComponent, SandpileAvalanchesComponent],
  templateUrl: './sandpile-article.component.html'
})
export class SandpileArticleComponent {
  static title = 'Modelo abeliano de pilas de arena';
  static route = 'abelian-sandpile';
}
