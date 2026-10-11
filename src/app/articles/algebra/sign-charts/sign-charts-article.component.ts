import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-sign-charts-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './sign-charts-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class SignChartsArticleComponent {
  static readonly title = "Inecuaciones y tablas de signos";
  static readonly route = "sign-charts";
}
