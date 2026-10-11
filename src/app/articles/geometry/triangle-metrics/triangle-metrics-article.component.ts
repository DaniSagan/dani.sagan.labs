import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-triangle-metrics-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './triangle-metrics-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class TriangleMetricsArticleComponent {
 static title = "Geometría del triángulo: radios, alturas y medianas";
 static route = 'triangle-metrics';
}
