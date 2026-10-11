import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-rational-root-theorem-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './rational-root-theorem-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class RationalRootTheoremArticleComponent {
  static readonly title = "Teorema de las raíces racionales";
  static readonly route = "rational-root-theorem";
}
