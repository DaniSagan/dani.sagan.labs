import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, regularPoints } from '../foundations/geometry-lab';

@Component({
  selector: 'app-apothem-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './apothem-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class ApothemArticleComponent {
  static title = 'Apotema de un polígono regular';
  static route = 'apothem';

  sides=5;
  readonly radius=2;
  get polygon(){return regularPoints(this.sides,110);}
  get midpoint(){const [a,b]=this.polygon;return [(a[0]+b[0])/2,(a[1]+b[1])/2];}
  get side(){return 2*this.radius*Math.sin(Math.PI/this.sides);}
  get labValue(){return this.radius*Math.cos(Math.PI/this.sides);}
  get area(){return this.sides*this.side*this.labValue/2;}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
