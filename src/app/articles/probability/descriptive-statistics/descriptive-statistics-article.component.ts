import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-descriptive-statistics-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './descriptive-statistics-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class DescriptiveStatisticsArticleComponent {
 static title = "Estadística descriptiva y valores atípicos";
 static route = 'descriptive-statistics';
}
