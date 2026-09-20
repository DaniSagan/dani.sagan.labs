import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { StirlingAccuracyComponent } from '../../../widgets/stirling/stirling-accuracy.component';
import { StirlingLaplaceComponent } from '../../../widgets/stirling/stirling-laplace.component';

@Component({
  selector: 'app-stirling-article', standalone: true,
  imports: [RouterModule, FormulaComponent, StirlingAccuracyComponent, StirlingLaplaceComponent],
  templateUrl: './stirling-article.component.html', styleUrl: './stirling-article.component.css'
})
export class StirlingArticleComponent {
  static title = 'La fórmula de Stirling';
  static route = 'stirling';
}
