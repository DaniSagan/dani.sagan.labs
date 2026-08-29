import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-ellipse-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './ellipse-article.component.html',
  styleUrls: ['./ellipse-article.component.css']
})
export class EllipseArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Elipse';
  static route: string = 'ellipse';

  title = EllipseArticleComponent.title;
  description = 'La elipse es la curva cerrada que aparece cuando la suma de las distancias a dos focos es constante; es un caso fundamental de las cónicas.';
  history = 'La elipse se estudió desde la geometría clásica y se hizo especialmente relevante con los trabajos de astronomía sobre los planetas, cuya órbita alrededor del Sol es aproximadamente elíptica. Kepler la convirtió en un concepto clave de la física celeste.';
  practicalUses = 'Las órbitas planetarias, los satélites artificiales, los sistemas de reflexión y muchos mecanismos de ingeniería se modelan con elipses. Además, en diseño y arquitectura se usa para crear formas equilibradas y estéticamente agradables.';

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
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => x ** 2 / this.a ** 2 + y ** 2 / this.b ** 2 - 1, 'red')];
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
    if (Math.abs(this.a) !== 1) terms += `\\frac{x^2}{${Math.abs(this.a)}^2}`;
    else terms += 'x^2';
    terms += ' + ';
    if (Math.abs(this.b) !== 1) terms += `\\frac{y^2}{${Math.abs(this.b)}^2}`;
    else terms += 'y^2';
    return `$$ ${terms} = 1 $$`;
  }
}

