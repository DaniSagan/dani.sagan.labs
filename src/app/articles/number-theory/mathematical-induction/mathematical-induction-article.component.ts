import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-mathematical-induction-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './mathematical-induction-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class MathematicalInductionArticleComponent {
  static readonly title = "Inducción matemática y construcción de pruebas";
  static readonly route = "mathematical-induction";
}
