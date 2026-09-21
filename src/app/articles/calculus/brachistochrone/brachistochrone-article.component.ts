import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BrachistochroneRaceComponent } from '../../../widgets/brachistochrone/brachistochrone-race.component';
import { CycloidConstructionComponent } from '../../../widgets/brachistochrone/cycloid-construction.component';
import { TautochroneExplorerComponent } from '../../../widgets/brachistochrone/tautochrone-explorer.component';

@Component({
  selector: 'app-brachistochrone-article', standalone: true,
  imports: [RouterLink, FormulaComponent, BrachistochroneRaceComponent, CycloidConstructionComponent, TautochroneExplorerComponent],
  templateUrl: './brachistochrone-article.component.html'
})
export class BrachistochroneArticleComponent {
  static title = 'Braquistócrona';
  static route = 'brachistochrone';
}
