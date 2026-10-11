import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-statistical-power-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './statistical-power-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class StatisticalPowerArticleComponent {
  static readonly title = "Potencia estadística y errores de contraste";
  static readonly route = "statistical-power";
}
