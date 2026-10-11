import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-rubik-invariants-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './rubik-invariants-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class RubikInvariantsArticleComponent {
  static readonly title = "Invariantes del cubo de Rubik";
  static readonly route = "rubik-invariants";
}
