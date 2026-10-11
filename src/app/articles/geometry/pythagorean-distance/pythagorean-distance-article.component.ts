import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-pythagorean-distance-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './pythagorean-distance-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class PythagoreanDistanceArticleComponent {
  static readonly title = "Pitágoras y distancia euclídea";
  static readonly route = "pythagorean-distance";
}
