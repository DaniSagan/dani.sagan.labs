import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-reflection-principle-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './reflection-principle-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ReflectionPrincipleArticleComponent {
 static title = "Principio de reflexión y caminos restringidos";
 static route = 'reflection-principle';
}
