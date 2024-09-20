import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathjaxModule } from 'mathjax-angular';

import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../widgets/widgets.module';
import { RouterModule } from '@angular/router';
import { GraphPlotterComponent } from './graph-plotter/graph-plotter.component';
import { PrimeDecompositionArticleComponent } from './prime-decomposition-article/prime-decomposition-article.component';
import { ToolsNavbarComponent } from './tools-navbar/tools-navbar.component';
import { ToolsContentComponent } from './tools-content/tools-content.component';
import { ToolsRoutingModule } from './tools-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    ToolsRoutingModule,
    GraphPlotterComponent,
    PrimeDecompositionArticleComponent,
    ToolsNavbarComponent,
    ToolsContentComponent,
  ],
})
export class ToolsModule {}
