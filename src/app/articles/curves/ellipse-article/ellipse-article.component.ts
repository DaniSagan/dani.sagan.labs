import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-ellipse-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './ellipse-article.component.html',
  styleUrls: ['./ellipse-article.component.css', '../curve-widget.css']
})
export class EllipseArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Elipse';
  static route: string = 'ellipse';

  title = EllipseArticleComponent.title;
  generalEquation = curveEquation('ellipse');

  a: number = 1;
  b: number = 1;

  ngOnInit() {
    this.curveGraph.setBounds(-10, 10, -10, 10);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => x ** 2 / this.a ** 2 + y ** 2 / this.b ** 2 - 1, 'red')];
    this.curveGraph.drawGraph();
  }

  onAChanged(value: number) {
    if (value === null || !Number.isFinite(value) || value < 1) return;
    this.a = value;
    this.onDraw();
  }

  onBChanged(value: number) {
    if (value === null || !Number.isFinite(value) || value < 1) return;
    this.b = value;
    this.onDraw();
  }

  getEquation(): string {
    return curveEquation('ellipse', { a: this.a, b: this.b });
  }
}
