import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-equation-of-time-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './equation-of-time-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class EquationOfTimeArticleComponent {
  static readonly title = "Ecuación del tiempo y mediodía solar";
  static readonly route = "equation-of-time";
}
