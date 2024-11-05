import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphPlotterComponent } from '../tools/graph-plotter/graph-plotter.component';
import { PrimeDecompositionArticleComponent } from '../tools/prime-decomposition-article/prime-decomposition-article.component';
import { ToolsContentComponent } from './tools-content/tools-content.component';
import { PiDecimalComponent } from './pi-decimal/pi-decimal.component';
import { ImplicitCurveGraphToolComponent } from './implicit-curve-graph-tool/implicit-curve-graph-tool.component';
import { SunPositionComponent } from './sun-position/sun-position.component';

const routes: Routes = [
  { path: '', component: ToolsContentComponent, children: [
      { path: 'graph-plotter', component: GraphPlotterComponent },
      { path: 'prime-decomposition', component: PrimeDecompositionArticleComponent },
      { path: 'pi-decimals', component: PiDecimalComponent },
      { path: 'implicit-curve-graph', component: ImplicitCurveGraphToolComponent },
      { path: 'sun-position', component: SunPositionComponent }
    ]
  }
];
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule]
})
export class ToolsRoutingModule { }
