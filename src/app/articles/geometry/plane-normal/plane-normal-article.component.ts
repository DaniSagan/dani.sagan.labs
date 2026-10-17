import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, project, points, Vector3 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-plane-normal-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './plane-normal-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class PlaneNormalArticleComponent {
  static title = 'Vector normal a un plano';
  static route = 'plane-normal';

  tilt=35;
  get normal():Vector3{return [Math.sin(this.tilt*Math.PI/180),0,Math.cos(this.tilt*Math.PI/180)];}
  get direction():Vector3{return [this.normal[2],0,-this.normal[0]];}
  get plane(){const u=this.direction;return points([[-2,-2],[2,-2],[2,2],[-2,2]].map(([a,b])=>project([a*u[0],b,a*u[2]])));}
  get tip(){const n=this.normal;return project([2*n[0],2*n[1],2*n[2]]);}
  get origin(){return project([0,0,0]);}
  get labValue(){return this.normal[0];}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
