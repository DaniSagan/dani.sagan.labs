import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-sampling-distributions-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './sampling-distributions-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class SamplingDistributionsArticleComponent {
 static title = "Distribuciones muestrales y error estándar";
 static route = 'sampling-distributions';
}
