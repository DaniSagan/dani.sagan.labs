import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-student-chi-square-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './student-chi-square-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class StudentChiSquareArticleComponent {
  static readonly title = "Distribuciones t de Student y chi-cuadrado";
  static readonly route = "student-chi-square";
}
