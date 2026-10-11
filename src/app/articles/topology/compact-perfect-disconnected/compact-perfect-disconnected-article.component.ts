import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-compact-perfect-disconnected-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './compact-perfect-disconnected-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class CompactPerfectDisconnectedArticleComponent {
  static readonly title = "Compactos, perfectos y totalmente desconectados";
  static readonly route = "compact-perfect-disconnected";
}
