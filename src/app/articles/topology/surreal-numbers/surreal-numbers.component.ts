import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { SurrealLabComponent } from './surreal-lab.component';
@Component({selector:'app-surreal-numbers',standalone:true,imports:[...LEARNING_IMPORTS,SurrealLabComponent],templateUrl:'./surreal-numbers.component.html',styleUrls:['../../shared/learning-article.css','./surreal-numbers.component.css']})
export class SurrealNumbersComponent {
 static readonly title='Números surreales: construir un universo desde cero';
 static readonly route='surreal-numbers';
}
