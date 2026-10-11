import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-burnside-lemma-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './burnside-lemma-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class BurnsideLemmaArticleComponent {
  static readonly title = "Acciones de grupos y lema de Burnside";
  static readonly route = "burnside-lemma";
}
