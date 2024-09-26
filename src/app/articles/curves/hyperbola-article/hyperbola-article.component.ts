import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Vec2 } from 'src/app/shared/math/vec2';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-hyperbola-article',
  standalone: true,
  imports: [ ImplicitCurveGraphComponent, FormsModule, MathjaxModule ],
  templateUrl: './hyperbola-article.component.html',
  styleUrl: './hyperbola-article.component.css'
})
export class HyperbolaArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', {static: true}) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Hipérbola';
  static route: string = 'hyperbola';

  a: number = 1;
  b: number = 1;
  equation: string = '$x$';

  ngOnInit() {
    this.equation = this.getEquation();
    this.curveGraph.setBounds(-10, 10, -10, 10);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => { return x**2/this.a**2 - y**2/this.b**2 - 1; }, 'red')];
    this.curveGraph.drawGraph();
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

  getEquation(): string {
    let terms = '';
    if(Math.abs(this.a) !== 1) terms += `\\frac{x^2}{${Math.abs(this.a)}^2}`;
    else terms += 'x^2';
    terms += ' - ';
    if(Math.abs(this.b) !== 1) terms += `\\frac{x^2}{${Math.abs(this.b)}^2}`;
    else terms += 'y^2';
    return `$$ ${terms} = 1 $$`
  }
}
