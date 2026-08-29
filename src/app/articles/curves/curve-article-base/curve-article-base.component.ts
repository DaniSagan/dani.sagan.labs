import { AfterViewInit, Directive, OnInit, ViewChild } from '@angular/core';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';
import { Vec2 } from 'src/app/shared/math/vec2';

export type CurveParamDefinition = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

@Directive()
export abstract class CurveArticleBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  title = '';
  description = '';
  history = '';
  practicalUses = '';
  bounds: [number, number, number, number] = [-4, 4, -4, 4];
  kind: 'implicit' | 'parametric' = 'implicit';
  paramDefinitions: CurveParamDefinition[] = [];
  params: Record<string, number> = {};
  equation = '$$ x = y $$';

  protected abstract buildEquation(params: Record<string, number>): string;
  protected abstract evaluateImplicit(x: number, y: number, params: Record<string, number>): number;
  protected paramX?: (t: number, params: Record<string, number>) => number;
  protected paramY?: (t: number, params: Record<string, number>) => number;

  ngOnInit(): void {
    this.params = Object.fromEntries(this.paramDefinitions.map((param) => [param.key, param.value]));
    this.equation = this.buildEquation(this.params);
    if (this.curveGraph) {
      this.curveGraph.setBounds(...this.bounds);
    }
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onParamChanged(key: string, value: number): void {
    this.params[key] = value;
    this.equation = this.buildEquation(this.params);
    this.onDraw();
  }

  protected drawImplicitCurve(): void {
    if (!this.curveGraph) {
      return;
    }

    this.curveGraph.functions = [
      new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y, this.params), 'red')
    ];
    this.curveGraph.drawGraph();
  }

  protected drawParametricCurve(): void {
    if (!this.curveGraph || !this.paramX || !this.paramY) {
      return;
    }

    this.curveGraph.clear();
    this.curveGraph.drawAxes();
    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      const steps = 1200;

      for (let i = 0; i < steps; i++) {
        const t = -Math.PI + (i / steps) * (2 * Math.PI);
        const x = this.paramX!(t, this.params);
        const y = this.paramY!(t, this.params);
        const point = this.curveGraph.xyToPixel(new Vec2(x, y));

        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
    });
  }

  onDraw(): void {
    if (!this.curveGraph) {
      return;
    }

    this.curveGraph.setBounds(...this.bounds);

    if (this.kind === 'implicit') {
      this.drawImplicitCurve();
      return;
    }

    this.drawParametricCurve();
  }
}
