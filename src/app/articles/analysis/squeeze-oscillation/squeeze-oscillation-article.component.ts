import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-squeeze-oscillation-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './squeeze-oscillation-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class SqueezeOscillationArticleComponent {
 static title = "Teorema del encaje y funciones oscilantes";
 static route = 'squeeze-oscillation';
}
