import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { FourierExplorerComponent } from '../../../widgets/fourier-series/fourier-explorer.component';

@Component({
  selector: 'app-fourier-series-article', standalone: true,
  imports: [RouterModule, FormulaComponent, FourierExplorerComponent],
  templateUrl: './fourier-series-article.component.html'
})
export class FourierSeriesArticleComponent {
  static title = 'Series de Fourier';
  static route = 'fourier-series';
}
