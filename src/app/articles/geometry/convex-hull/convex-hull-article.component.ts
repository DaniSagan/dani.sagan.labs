import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, convexHull2, Point2 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-convex-hull-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './convex-hull-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class ConvexHullArticleComponent {
  static title = 'Convexidad y envolvente convexa';
  static route = 'convex-hull';

  position=1;
  readonly fixed:Point2[]=[[0,0],[3,0],[2,3],[0,2]];
  get all():Point2[]{return [...this.fixed,[this.position,1]];}
  get hull(){return convexHull2(this.all);}
  screen(p:Point2):Point2{return [160+40*p[0],250-50*p[1]];}
  get polygon(){return points(this.hull.map(p=>this.screen(p)));}
  get labValue(){return this.hull.length;}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
