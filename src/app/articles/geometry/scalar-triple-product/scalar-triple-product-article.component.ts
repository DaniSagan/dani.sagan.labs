import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, project, Vector3 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-scalar-triple-product-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './scalar-triple-product-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class ScalarTripleProductArticleComponent {
  static title = 'Producto mixto';
  static route = 'scalar-triple-product';

  height=2;
  get corners(){return Array.from({length:8},(_,i)=>project([2*(i&1)+0.6*((i>>2)&1),3*((i>>1)&1)+0.5*((i>>2)&1),this.height*((i>>2)&1)]));}
  get segments(){const result:number[][]=[];for(let i=0;i<8;i++)for(let bit=0;bit<3;bit++)if(!(i&(1<<bit)))result.push([i,i|(1<<bit)]);return result;}
  get labValue(){return 6*this.height;}
  readonly Math=Math;
  readonly format=format;

}
