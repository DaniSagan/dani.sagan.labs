import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-agnesi-witch-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './agnesi-witch-article.component.html',
  styleUrls: ['./agnesi-witch-article.component.css', '../curve-widget.css']
})
export class AgnesiWitchArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Bruja de Agnesi';
  static route: string = 'agnesi-witch';

  title = AgnesiWitchArticleComponent.title;
  generalEquation = curveEquation('agnesi-witch');

  a: number = 1;
  b: number = 1;

  ngOnInit() {
    this.curveGraph.setBounds(-10, 10, -10, 10);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onDraw() {
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => y * (x * x + this.a * this.a) - this.b * this.a * this.a, 'red')];
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
    return curveEquation('agnesi-witch', { a: this.a, b: this.b });
  }
}
