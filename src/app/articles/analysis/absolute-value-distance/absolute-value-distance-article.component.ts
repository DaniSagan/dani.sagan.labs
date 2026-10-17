import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-absolute-value-distance-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './absolute-value-distance-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class AbsoluteValueDistanceArticleComponent {
 static readonly title = "Valor absoluto: distancias y funciones a trozos";
 static readonly route = 'absolute-value-distance';

 center=0; radius=2;
 get series(): PlotSeries[]{return [{label:'Distancia a c',points:Array.from({length:121},(_,i)=>{const x=-6+i/10;return [x,Math.abs(x-this.center)] as [number,number];})},{label:'Radio r',dashed:true,points:[[-6,this.radius],[6,this.radius]]}];}
 get interval(){return [this.center-this.radius,this.center+this.radius];}
 reset(){this.center=0;this.radius=2;}

}
