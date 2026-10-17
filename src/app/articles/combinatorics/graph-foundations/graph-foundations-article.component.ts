import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-graph-foundations-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './graph-foundations-article.component.html',
 styleUrls: ['../../shared/learning-article.css', './graph-foundations-article.component.css'],
})
export class GraphFoundationsArticleComponent {
 static readonly title = "Grafos desde cero: grados, caminos y conectividad";
 static readonly route = 'graph-foundations';

 readonly vertices=[{name:'A',x:110,y:60},{name:'B',x:350,y:60},{name:'C',x:350,y:230},{name:'D',x:110,y:230}];
 edges=[{a:0,b:1,on:true},{a:1,b:2,on:true},{a:2,b:3,on:true},{a:3,b:0,on:true},{a:0,b:2,on:true},{a:1,b:3,on:false}];
 get active(){return this.edges.filter(e=>e.on);}
 get degrees(){return this.vertices.map((_,i)=>this.active.filter(e=>e.a===i||e.b===i).length);}
 get odd(){return this.degrees.filter(d=>d%2!==0).length;}
 reachable(start:number){const seen=new Set<number>([start]);const queue=[start];while(queue.length){const v=queue.shift()!;for(const e of this.active){const w=e.a===v?e.b:e.b===v?e.a:-1;if(w>=0&&!seen.has(w)){seen.add(w);queue.push(w);}}}return seen;}
 get components(){const seen=new Set<number>();let count=0;for(let i=0;i<4;i++)if(!seen.has(i)){count++;for(const v of this.reachable(i))seen.add(v);}return count;}
 get verdict(){if(!this.active.length)return 'Sin aristas: recorrido vacío en cualquier vértice.';const start=this.degrees.findIndex(d=>d>0);const seen=this.reachable(start);if(this.degrees.some((d,i)=>d>0&&!seen.has(i)))return 'Las aristas están en componentes distintas: no hay recorrido euleriano.';return this.odd===0?'Existe un circuito euleriano.':this.odd===2?'Existe un recorrido euleriano abierto, entre los dos vértices impares.':'Hay '+this.odd+' vértices impares: no existe recorrido euleriano.';}
 adjacent(i:number,j:number){return this.active.some(e=>(e.a===i&&e.b===j)||(e.a===j&&e.b===i))?1:0;}
 reset(){this.edges.forEach((e,i)=>e.on=i<5);}

}
