import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-algebraic-identities-factorization-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './algebraic-identities-factorization-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class AlgebraicIdentitiesFactorizationArticleComponent {
 static readonly title = "Identidades algebraicas y técnicas de factorización";
 static readonly route = 'algebraic-identities-factorization';

 center=3; constant=4;
 get expanded(){return 'x^2-'+(2*this.center)+'x+'+(this.center*this.center+this.constant)+'=(x-'+this.center+')^2+'+this.constant;}
 get series(): PlotSeries[]{return [{label:'Cuadrática',points:Array.from({length:101},(_,i)=>{const x=-2+i*.12;return [x,(x-this.center)**2+this.constant] as [number,number];})}];}
 get markers(){return [{x:this.center,y:this.constant,label:'Mínimo'}];}
 reset(){this.center=3;this.constant=4;}

}
