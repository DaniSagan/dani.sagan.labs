import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, project, points, Vector3 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-cross-product-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './cross-product-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class CrossProductArticleComponent {
  static title = 'Producto vectorial';
  static route = 'cross-product';

  angle=50; reversed=false;
  get u():Vector3{return [2,0,0];}
  get v():Vector3{return [3*Math.cos(this.angle*Math.PI/180),3*Math.sin(this.angle*Math.PI/180),0];}
  get z(){return (this.reversed?-1:1)*6*Math.sin(this.angle*Math.PI/180);}
  get polygon(){const v=this.v;return points([[0,0,0],this.u,[2+v[0],v[1],0],v].map(p=>project(p as Vector3)));}
  get tip(){return project([0,0,this.z]);}
  get origin(){return project([0,0,0]);}
  get labValue(){return this.z;}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
