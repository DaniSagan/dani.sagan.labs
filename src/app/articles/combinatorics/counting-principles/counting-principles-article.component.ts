import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-counting-principles-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './counting-principles-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CountingPrinciplesArticleComponent {
  static readonly title = "Principios de conteo: suma, producto y elecciones";
  static readonly route = "counting-principles";
}
