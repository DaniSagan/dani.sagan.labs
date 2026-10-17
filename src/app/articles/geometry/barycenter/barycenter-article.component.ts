import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, Point2 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-barycenter-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './barycenter-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class BarycenterArticleComponent {
  static title = 'Baricentro y centro de masas';
  static route = 'barycenter';

  mass=1;
  readonly triangle:Point2[]=[[0,0],[4,0],[1,3]];
  screen(p:Point2):Point2{return [90+50*p[0],250-50*p[1]];}
  get center():Point2{return [(4+this.mass)/(2+this.mass),3*this.mass/(2+this.mass)];}
  get medians(){return this.triangle.map((a,i)=>[this.screen(a),this.screen([(this.triangle[(i+1)%3][0]+this.triangle[(i+2)%3][0])/2,(this.triangle[(i+1)%3][1]+this.triangle[(i+2)%3][1])/2])]);}
  get labValue(){return this.center[1];}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

  get polygon(){return points(this.triangle.map(p=>this.screen(p)));}

}
