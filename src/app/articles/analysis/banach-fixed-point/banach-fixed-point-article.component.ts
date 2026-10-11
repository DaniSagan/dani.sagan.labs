import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-banach-fixed-point-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './banach-fixed-point-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class BanachFixedPointArticleComponent {
  static readonly title = "Teorema del punto fijo de Banach";
  static readonly route = "banach-fixed-point";
}
