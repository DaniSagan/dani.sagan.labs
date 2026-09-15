import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { EulerIdentityExplorerComponent } from '../../../widgets/euler-identity/euler-identity-explorer.component';
import { EulerSeriesComponent } from '../../../widgets/euler-identity/euler-series.component';

@Component({
  selector: 'app-euler-identity-article', standalone: true,
  imports: [RouterLink, FormulaComponent, EulerIdentityExplorerComponent, EulerSeriesComponent],
  templateUrl: './euler-identity-article.component.html'
})
export class EulerIdentityArticleComponent {
  static title = 'La identidad de Euler';
  static route = 'euler-identity';
}
