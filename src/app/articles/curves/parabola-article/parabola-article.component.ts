import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Vec2 } from 'src/app/shared/math/vec2';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-parabola-article',
  standalone: true,
  imports: [ ImplicitCurveGraphComponent, FormsModule, MathjaxModule ],
  templateUrl: './parabola-article.component.html',
  styleUrl: './parabola-article.component.css'
})
export class ParabolaArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', {static: true}) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Parábola';
  static route: string = 'parabola';

  a: number = 1;
  b: number = 0;
  c: number = 0;
  eq2: string = '$x^2$';
  equation!: string;

  ngOnInit() {
    this.equation = this.getEquation();
    this.curveGraph.setBounds(-2, 2, -2, 2);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => { return this.a*x**2 + this.b*x + this.c - y; }, 'red')];
    this.curveGraph.drawGraph();
    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      let focus: Vec2 = this.getFocus();
      let focusPixel: Vec2 = this.curveGraph.xyToPixel(focus);
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.arc(focusPixel.x, focusPixel.y, 2, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }

  onAChanged(value: number) {
    this.a = value;
    this.equation = this.getEquation();
    this.onDraw();
  }

  onBChanged(value: number) {
    this.b = value;
    this.equation = this.getEquation();
    this.onDraw();
  }

  onCChanged(value: number) {
    this.c = value;
    this.equation = this.getEquation();
    this.onDraw();
  }

  getEquation(): string {
    let terms = '';
    if(this.a != 0) {
      if(this.a < 0) terms += ' - ';
      if(Math.abs(this.a) !== 1) terms += `${Math.abs(this.a)}`;
      terms += 'x^2';
    }
    if(this.b != 0) {
      if(this.b < 0) terms += ' - ';
      else if(terms !== '') terms += ' + ';
      if(Math.abs(this.b) !== 1) terms += `${Math.abs(this.b)}`;
      terms += 'x';
    }
    if(this.c != 0) {
      if(this.c < 0) terms += ' - ';
      else if(terms !== '') terms += ' + ';
      terms += `${Math.abs(this.c)}`;
    }
    if(terms === '') terms = '0';
    return `$$ ${terms} = 0 $$`
    //return `$ x = 0 $`
  }

  getFocus(): Vec2 {
    return {x: -this.b / (2 * this.a), y: (4*this.a*this.c - this.b**2 + 1) / (4* this.a)};
  }

}
