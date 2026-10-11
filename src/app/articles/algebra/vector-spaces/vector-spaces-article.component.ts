import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-vector-spaces-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './vector-spaces-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class VectorSpacesArticleComponent {
  static readonly title = "Espacios vectoriales, bases y rango–nulidad";
  static readonly route = "vector-spaces";
}
