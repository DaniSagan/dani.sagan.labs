import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-phasor-superposition-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './phasor-superposition-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class PhasorSuperpositionArticleComponent {
 static title = "Fasores y superposición de ondas";
 static route = 'phasor-superposition';
}
