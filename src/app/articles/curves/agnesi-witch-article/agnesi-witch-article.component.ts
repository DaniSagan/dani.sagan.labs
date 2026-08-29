import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-agnesi-witch-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './agnesi-witch-article.component.html',
  styleUrls: ['./agnesi-witch-article.component.css']
})
export class AgnesiWitchArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Bruja de Agnesi';
  static route: string = 'agnesi-witch';

  title = AgnesiWitchArticleComponent.title;

  a: number = 1;
  b: number = 1;

  ngOnInit() {
    this.curveGraph.setBounds(-10, 10, -10, 10);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => (x / this.a) ** 3 + (y / this.b) ** 3 - 1, 'red')];
    this.curveGraph.drawGraph();
  }

  onAChanged(value: number) {
    this.a = value;
    this.onDraw();
  }

  onBChanged(value: number) {
    this.b = value;
    this.onDraw();
  }

  getEquation(): string {
    let terms = '';
    if (Math.abs(this.a) !== 1) terms += `\\left(\\frac{x}{${Math.abs(this.a)}}\\right)^3`;
    else terms += 'x^3';
    terms += ' + ';
    if (Math.abs(this.b) !== 1) terms += `\\left(\\frac{y}{${Math.abs(this.b)}}\\right)^3`;
    else terms += 'y^3';
    return `$$ ${terms} = 1 $$`;
  }
}
