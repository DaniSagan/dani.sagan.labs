import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, Point2 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-incircles-circumcircles-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './incircles-circumcircles-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class IncirclesCircumcirclesArticleComponent {
  static title = 'Circunferencias inscritas y circunscritas';
  static route = 'incircles-circumcircles';

  apex=2;
  get a(){return Math.hypot(this.apex-4,3);}
  get b(){return Math.hypot(this.apex,3);}
  get perimeter(){return this.a+this.b+4;}
  get incenter(){return [(4*this.b+4*this.apex)/this.perimeter,12/this.perimeter] as Point2;}
  get circumcenter(){return [2,(this.apex*this.apex+9-4*this.apex)/6] as Point2;}
  get inradius(){return 12/this.perimeter;}
  get circumradius(){return Math.hypot(...this.circumcenter);}
  screen(p:Point2):Point2{return [60+45*p[0],250-45*p[1]];}
  get triangle(){const vertices:Point2[]=[[0,0],[4,0],[this.apex,3]];return points(vertices.map(p=>this.screen(p)));}
  get labValue(){return Math.hypot(this.incenter[0]-this.circumcenter[0],this.incenter[1]-this.circumcenter[1]);}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
