import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-conditional-independence-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './conditional-independence-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ConditionalIndependenceArticleComponent {
 static title = "Probabilidad condicionada e independencia";
 static route = 'conditional-independence';
}
