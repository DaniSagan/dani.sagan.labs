import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-monotone-convergence-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './monotone-convergence-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class MonotoneConvergenceArticleComponent {
 static title = "Sucesiones monótonas y acotadas";
 static route = 'monotone-convergence';
}
