import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points } from '../foundations/geometry-lab';

@Component({
  selector: 'app-schlafli-symbol-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './schlafli-symbol-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class SchlafliSymbolArticleComponent {
  static title = 'Símbolo de Schläfli';
  static route = 'schlafli-symbol';

  index=0;
  readonly solids=[{name:'Tetraedro',p:3,q:3,n:4,e:6,f:4},{name:'Cubo',p:4,q:3,n:8,e:12,f:6},{name:'Octaedro',p:3,q:4,n:6,e:12,f:8},{name:'Dodecaedro',p:5,q:3,n:20,e:30,f:12},{name:'Icosaedro',p:3,q:5,n:12,e:30,f:20}];
  get solid(){return this.solids[this.index];}
  get defect(){return 360-this.solid.q*(180-360/this.solid.p);}
  get fan(){const {p,q}=this.solid,alpha=180-360/p;return Array.from({length:q},(_,i)=>{let x=200,y=160;const list: [number,number][]=[[x,y]];for(let j=0;j<p-1;j++){const t=(i*alpha+j*360/p)*Math.PI/180;x+=60*Math.cos(t);y-=60*Math.sin(t);list.push([x,y]);}return points(list);});}
  get labValue(){return this.defect;}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
