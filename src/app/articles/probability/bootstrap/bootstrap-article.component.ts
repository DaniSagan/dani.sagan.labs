import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-bootstrap-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './bootstrap-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class BootstrapArticleComponent {
  static readonly title = "Bootstrap y estimación por remuestreo";
  static readonly route = "bootstrap";
}
