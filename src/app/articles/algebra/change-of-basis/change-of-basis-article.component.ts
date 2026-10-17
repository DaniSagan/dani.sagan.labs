import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-change-of-basis-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './change-of-basis-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class ChangeOfBasisArticleComponent {
 static readonly title = "Cambios de base y matrices de una transformación";
 static readonly route = 'change-of-basis';

 parameter=-1; x=5; y=1;
 get determinant(){return this.parameter-1;}
 get coordinates(): [number,number]|null{if(this.determinant===0)return null;const b=(this.y-this.x)/this.determinant;return [this.x-b,b];}
 get status(){return this.coordinates?'Coordenadas únicas en esta base.':this.y===this.x?'Los vectores son dependientes: hay infinitas representaciones, pero no forman una base del plano.':'Los vectores son dependientes y no generan el vector objetivo.';}
 get series(): PlotSeries[]{const c=this.coordinates;return [{label:'u=(1,1)',points:[[0,0],[1,1]]},{label:'w=(1,t)',points:[[0,0],[1,this.parameter]]},{label:'Vector objetivo',points:[[0,0],[this.x,this.y]]},...(c?[{label:'a·u y después b·w',dashed:true,points:[[0,0],[c[0],c[0]],[this.x,this.y]] as [number,number][] }]:[])];}
 get extent(){return Math.max(3,Math.abs(this.x)+1,Math.abs(this.y)+1,Math.abs(this.parameter)+1,Math.abs(this.coordinates?.[0]??0)+1);}
 reset(){this.parameter=-1;this.x=5;this.y=1;}

}
