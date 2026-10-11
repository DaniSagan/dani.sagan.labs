import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-asymptotic-limits-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './asymptotic-limits-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class AsymptoticLimitsArticleComponent {
 static title = "Límites, equivalencias y jerarquías de crecimiento";
 static route = 'asymptotic-limits';
}
