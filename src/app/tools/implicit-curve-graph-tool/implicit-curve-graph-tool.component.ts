import { Component, Input, ViewChild } from '@angular/core';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { ImplicitCurveGraphComponent } from "../../widgets/implicit-curve-graph/implicit-curve-graph.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-implicit-curve-graph-tool',
  standalone: true,
  imports: [WidgetsModule, ImplicitCurveGraphComponent, FormsModule],
  templateUrl: './implicit-curve-graph-tool.component.html',
  styleUrl: './implicit-curve-graph-tool.component.css'
})
export class ImplicitCurveGraphToolComponent {
  @ViewChild('curveGraph', {static: true}) curveGraph!: ImplicitCurveGraphComponent;
  formula: string = 'x*x + y*y - 1';
  xMin: number = -10;
  xMax: number = 10;
  yMin: number = -10;
  yMax: number = 10;

  onRedraw() {
    if(this.validateFormula(this.formula)) {
      const replacedFormula = new Function('x', 'y', `return ${this.formula}`);
      this.curveGraph.setBounds(this.xMin, this.xMax, this.yMin, this.yMax);
      this.curveGraph.drawGraph(replacedFormula);
    }
  }

  private validateFormula(formula: string) {
    if(formula.indexOf('x') < 0) return false;
    if(formula.indexOf('y') < 0) return false;
    return true;
  }
}
