import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { PlaneEulerExplorerComponent } from '../../../widgets/plane-euler/plane-euler-explorer.component';
import { PlanarityBoundComponent } from '../../../widgets/plane-euler/planarity-bound.component';

@Component({
  selector: 'app-planar-euler-article', standalone: true,
  imports: [RouterModule, FormulaComponent, PlaneEulerExplorerComponent, PlanarityBoundComponent],
  templateUrl: './planar-euler-article.component.html', styleUrl: './planar-euler-article.component.css'
})
export class PlanarEulerArticleComponent {
  static title = 'La fórmula de Euler para grafos planares';
  static route = 'planar-euler';
}
