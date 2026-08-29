import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-hyperbola-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MathjaxModule, ImplicitCurveGraphComponent],
  templateUrl: './hyperbola-article.component.html',
  styleUrls: ['./hyperbola-article.component.css']
})
export class HyperbolaArticleComponent implements AfterViewInit, OnInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  static title: string = 'Hipérbola';
  static route: string = 'hyperbola';

  title = HyperbolaArticleComponent.title;
  description = 'La hipérbola es una cónica abierta formada por dos ramas simétricas y aparece en astronomía, navegación y en el análisis de trayectorias con diferencia constante de distancias.';
  history = 'Las cónicas fueron estudiadas por los geómetras griegos, pero la hipérbola ganó renombre en la astronomía moderna por su relación con las órbitas y con las propiedades de los focos. La definición como lugar geométrico de puntos con diferencia constante fue un avance decisivo en la geometría analítica.';
  practicalUses = 'En navegación, telecomunicaciones y radioastronomía se usa para localizar posiciones a partir de señales emitidas desde dos puntos distintos. También aparece en la modelización de trayectorias cósmicas y en el estudio de sistemas con dos focos.';

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
    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => x ** 2 / this.a ** 2 - y ** 2 / this.b ** 2 - 1, 'red')];
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
    terms += ' - ';
    if (Math.abs(this.b) !== 1) terms += `\\frac{y^2}{${Math.abs(this.b)}^2}`;
    else terms += 'y^2';
    return `$$ ${terms} = 1 $$`;
  }
}

