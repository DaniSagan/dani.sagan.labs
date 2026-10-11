import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-sine-law-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './sine-law-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class SineLawArticleComponent {
  static readonly title = "Ley de los senos y caso ambiguo";
  static readonly route = "sine-law";
}
