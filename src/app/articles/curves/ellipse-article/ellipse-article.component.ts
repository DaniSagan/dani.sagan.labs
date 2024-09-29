import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-ellipse-article',
  standalone: true,
  imports: [ ImplicitCurveGraphComponent, FormsModule, MathjaxModule ],
  templateUrl: './ellipse-article.component.html',
  styleUrl: './ellipse-article.component.css'
})
export class EllipseArticleComponent {
  @ViewChild('curveGraph', {static: true}) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Elipse';
  static route: string = 'ellipse';

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
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => { return x**2/this.a**2 + y**2/this.b**2 - 1; }, 'red')];
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
    terms += ' + ';
    if(Math.abs(this.b) !== 1) terms += `\\frac{y^2}{${Math.abs(this.b)}^2}`;
    else terms += 'y^2';
    return `$$ ${terms} = 1 $$`
  }
}
