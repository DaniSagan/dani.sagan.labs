import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, norm3, project, Vector3 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-vector-norm-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './vector-norm-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class VectorNormArticleComponent {
  static title = 'Vectores y norma euclídea';
  static route = 'vector-norm';

  x=3;y=4;z=0;
  get vector():Vector3{return [this.x,this.y,this.z];}
  get tip(){return project(this.vector);}
  get origin(){return project([0,0,0]);}
  get labValue(){return norm3(this.vector);}
  readonly Math=Math;
  readonly format=format;

}
