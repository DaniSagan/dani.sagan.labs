import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-utc-date-arithmetic-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './utc-date-arithmetic-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class UtcDateArithmeticArticleComponent {
 static title = "UTC, husos horarios y aritmética de fechas";
 static route = 'utc-date-arithmetic';
}
