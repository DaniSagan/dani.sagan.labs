import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Vec2 } from 'src/app/shared/math/vec2';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-parabola-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './parabola-article.component.html',
  styleUrls: ['./parabola-article.component.css']
})
export class ParabolaArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Parábola';
  static route: string = 'parabola';

  title = ParabolaArticleComponent.title;

  a: number = 1;
  b: number = 0;
  c: number = 0;

  ngOnInit() {
    this.curveGraph.setBounds(-2, 2, -2, 2);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.a * x ** 2 + this.b * x + this.c - y, 'red')];
    this.curveGraph.drawGraph();

    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      const focus: Vec2 = this.getFocus();
      const focusPixel: Vec2 = this.curveGraph.xyToPixel(focus);
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.arc(focusPixel.x, focusPixel.y, 2, 0, 2 * Math.PI);
      ctx.stroke();
    });

    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      const directrixY: number = this.getDirectrixY();
      const directrixPixelY: number = this.curveGraph.yToPixel(directrixY);
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.moveTo(0, directrixPixelY);
      ctx.lineTo(ctx.canvas.width, directrixPixelY);
      ctx.stroke();
    });
  }

  onAChanged(value: number) {
    this.a = value;
    this.onDraw();
  }

  onBChanged(value: number) {
    this.b = value;
    this.onDraw();
  }

  onCChanged(value: number) {
    this.c = value;
    this.onDraw();
  }

  getEquation(): string {
    let terms = '';
    if (this.a !== 0) {
      if (this.a < 0) terms += ' - ';
      if (Math.abs(this.a) !== 1) terms += `${Math.abs(this.a)}`;
      terms += 'x^2';
    }
    if (this.b !== 0) {
      if (this.b < 0) terms += ' - ';
      else if (terms !== '') terms += ' + ';
      if (Math.abs(this.b) !== 1) terms += `${Math.abs(this.b)}`;
      terms += 'x';
    }
    if (this.c !== 0) {
      if (this.c < 0) terms += ' - ';
      else if (terms !== '') terms += ' + ';
      terms += `${Math.abs(this.c)}`;
    }
    if (terms === '') terms = '0';
    return `$$ ${terms} = 0 $$`;
  }

  getFocus(): Vec2 {
    return new Vec2(-this.b / (2 * this.a), (4 * this.a * this.c - this.b ** 2 + 1) / (4 * this.a));
  }

  getDirectrixY(): number {
    return (4 * this.a * this.c - this.b ** 2 - 1) / (4 * this.a);
  }
}
