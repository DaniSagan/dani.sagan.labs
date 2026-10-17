import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-factorials-legendre-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './factorials-legendre-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class FactorialsLegendreArticleComponent {
 static readonly title = "Factoriales, exponentes primos y fórmula de Legendre";
 static readonly route = 'factorials-legendre';

 n=25; prime=5;
 valuation(n:number,p:number){let sum=0;for(let q=p;q<=n;q*=p)sum+=Math.floor(n/q);return sum;}
 get rows(){const rows:{power:number,count:number}[]=[];for(let q=this.prime;q<=this.n;q*=this.prime)rows.push({power:q,count:Math.floor(this.n/q)});return rows;}
 get exponent(){return this.valuation(this.n,this.prime);}
 get zeros(){return Math.min(this.valuation(this.n,2),this.valuation(this.n,5));}
 get series(): PlotSeries[]{return [{label:'Exponentes de p en m!',kind:'bars',points:Array.from({length:this.n+1},(_,m)=>[m,this.valuation(m,this.prime)] as [number,number])}];}
 reset(){this.n=25;this.prime=5;}

}
