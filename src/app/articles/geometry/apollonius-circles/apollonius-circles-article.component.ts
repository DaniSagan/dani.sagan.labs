import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-apollonius-circles-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './apollonius-circles-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ApolloniusCirclesArticleComponent {
 static title = "Circunferencias de Apolonio y razones de distancias";
 static route = 'apollonius-circles';
}
