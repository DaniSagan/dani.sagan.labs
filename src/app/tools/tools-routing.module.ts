import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphPlotterComponent } from '../tools/graph-plotter/graph-plotter.component';
import { PrimeDecompositionArticleComponent } from '../tools/prime-decomposition-article/prime-decomposition-article.component';
import { ToolsContentComponent } from './tools-content/tools-content.component';
import { PiDecimalComponent } from './pi-decimal/pi-decimal.component';

const routes: Routes = [
  { path: '', component: ToolsContentComponent, children: [
      { path: 'graph-plotter', component: GraphPlotterComponent },
      { path: 'prime-decomposition', component: PrimeDecompositionArticleComponent },
      { path: 'pi-decimals', component: PiDecimalComponent }
    ]
  }
];
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule]
})
export class ToolsRoutingModule { }
