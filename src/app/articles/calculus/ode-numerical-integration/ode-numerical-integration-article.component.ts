import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-ode-numerical-integration-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './ode-numerical-integration-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class OdeNumericalIntegrationArticleComponent {
  static readonly title = "Integración numérica de ecuaciones diferenciales";
  static readonly route = "ode-numerical-integration";
}
