import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-euler-hamilton-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './euler-hamilton-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class EulerHamiltonArticleComponent {
  static readonly title = "Recorridos eulerianos y caminos hamiltonianos";
  static readonly route = "euler-hamilton";
}
