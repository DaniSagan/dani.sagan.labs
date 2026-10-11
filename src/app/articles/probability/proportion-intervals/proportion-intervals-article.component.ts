import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-proportion-intervals-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './proportion-intervals-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class ProportionIntervalsArticleComponent {
  static readonly title = "Intervalos para proporciones: Wilson y métodos exactos";
  static readonly route = "proportion-intervals";
}
