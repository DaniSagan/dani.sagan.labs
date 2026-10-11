import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-complex-arithmetic-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './complex-arithmetic-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class ComplexArithmeticArticleComponent {
  static readonly title = "Conjugado, módulo y división compleja";
  static readonly route = "complex-arithmetic";
}
