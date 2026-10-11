import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-bessel-correction-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './bessel-correction-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class BesselCorrectionArticleComponent {
 static title = "Corrección de Bessel y estimadores insesgados";
 static route = 'bessel-correction';
}
