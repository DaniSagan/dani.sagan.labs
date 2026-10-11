import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-mean-value-theorems-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './mean-value-theorems-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class MeanValueTheoremsArticleComponent {
 static title = "Teoremas de Rolle y del valor medio";
 static route = 'mean-value-theorems';
}
