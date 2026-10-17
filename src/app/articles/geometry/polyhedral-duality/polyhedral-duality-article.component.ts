import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, regularPoints } from '../foundations/geometry-lab';

@Component({
  selector: 'app-polyhedral-duality-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './polyhedral-duality-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class PolyhedralDualityArticleComponent {
  static title = 'Dualidad de polígonos y poliedros';
  static route = 'polyhedral-duality';

  sides=4;
  get polygon(){return regularPoints(this.sides,70,-90);}
  get dual(){return this.polygon.map((a,i)=>{const b=this.polygon[(i+1)%this.sides],x=(a[0]+b[0])/2-200,y=(a[1]+b[1])/2-160,k=4900/(x*x+y*y);return [200+k*x,160+k*y] as [number,number];});}
  get labValue(){return 1/Math.cos(Math.PI/this.sides);}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
