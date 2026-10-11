import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-prime-valuations-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './prime-valuations-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class PrimeValuationsArticleComponent {
 static title = "Irracionalidad y valuaciones primas";
 static route = 'prime-valuations';
}
