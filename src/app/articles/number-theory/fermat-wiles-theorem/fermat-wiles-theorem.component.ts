import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
@Component({ selector: 'app-fermat-wiles-theorem', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './fermat-wiles-theorem.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class FermatWilesTheoremComponent {
  static readonly title = 'Fermat-Wiles: enunciado, reducciones y alcance de la demostración';
  static readonly route = 'fermat-wiles-theorem';
  exponent = 3; bound = 20;
  results: [number,number,number][] = [];
  readonly math = {
    theorem: String.raw`x^n+y^n=z^n,\qquad x,y,z\in\mathbb Z_{>0},\quad n\in\mathbb Z,\ n>2\quad\text{no tiene soluciones}`,
    reduction: String.raw`n=pm\quad\Longrightarrow\quad (x^m)^p+(y^m)^p=(z^m)^p`,
    curve: String.raw`E:\quad Y^2=X(X-a^p)(X+b^p)`,
  };
  constructor(){this.search();}
  search(): void {
    const n=this.exponent,b=this.bound;
    if(!Number.isInteger(n)||n<2||n>8||!Number.isInteger(b)||b<5||b>40){this.results=[];return;}
    const powers=new Map<string,number>();
    for(let c=1;c<=b;c++)powers.set((BigInt(c)**BigInt(n)).toString(),c);
    const rows:[number,number,number][]=[];
    for(let a=1;a<=b;a++)for(let c=a;c<=b;c++){
      const z=powers.get((BigInt(a)**BigInt(n)+BigInt(c)**BigInt(n)).toString());
      if(z!==undefined)rows.push([a,c,z]);
    }
    this.results=rows;
  }
}
