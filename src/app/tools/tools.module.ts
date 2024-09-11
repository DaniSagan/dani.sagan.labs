import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathjaxModule } from 'mathjax-angular';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../widgets/widgets.module';
import { RouterModule } from '@angular/router';
import { GraphPlotterComponent } from './graph-plotter/graph-plotter.component';
import { PrimeDecompositionArticleComponent } from './prime-decomposition-article/prime-decomposition-article.component';
import { ToolsNavbarComponent } from './tools-navbar/tools-navbar.component';
import { ToolsContentComponent } from './tools-content/tools-content.component';
import { ToolsRoutingModule } from './tools-routing.module';

@NgModule({
  declarations: [
    GraphPlotterComponent,
    PrimeDecompositionArticleComponent,
    ToolsNavbarComponent,
    ToolsContentComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    WidgetsModule,
    FormsModule,
    RouterModule,
    ToolsRoutingModule
  ]
})
export class ToolsModule { }
