import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-solar-geometry-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './solar-geometry-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class SolarGeometryArticleComponent {
 static title = "Geometría solar: latitud, declinación y altura";
 static route = 'solar-geometry';
}
