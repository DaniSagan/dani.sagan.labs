import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { GaltonBoardComponent } from '../../../widgets/galton/galton-board.component';
import { GaltonPathsComponent } from '../../../widgets/galton/galton-paths.component';
import { GaltonNormalComponent } from '../../../widgets/galton/galton-normal.component';

@Component({
  selector: 'app-galton-board-article', standalone: true,
  imports: [RouterModule, FormulaComponent, GaltonBoardComponent, GaltonPathsComponent, GaltonNormalComponent],
  templateUrl: './galton-board-article.component.html', styleUrl: './galton-board-article.component.css'
})
export class GaltonBoardArticleComponent {
  static title = 'El tablero de Galton';
  static route = 'galton-board';
}
