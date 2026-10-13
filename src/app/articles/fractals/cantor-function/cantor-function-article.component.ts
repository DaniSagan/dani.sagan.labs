import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({ host: { class: 'fractal-page' },
  selector: 'app-cantor-function-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './cantor-function-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CantorFunctionArticleComponent {
  static readonly title = "Función de Cantor y distribuciones singulares";
  static readonly route = "cantor-function";
}
