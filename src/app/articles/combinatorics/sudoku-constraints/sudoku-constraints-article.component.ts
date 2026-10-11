import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-sudoku-constraints-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './sudoku-constraints-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class SudokuConstraintsArticleComponent {
  static readonly title = "Sudoku: restricciones y cobertura exacta";
  static readonly route = "sudoku-constraints";
}
