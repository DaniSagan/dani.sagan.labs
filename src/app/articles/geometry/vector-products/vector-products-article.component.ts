import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-vector-products-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './vector-products-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class VectorProductsArticleComponent {
 static title = "Producto vectorial y producto mixto";
 static route = 'vector-products';
}
