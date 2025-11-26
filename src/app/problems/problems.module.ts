import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxModule } from 'mathjax-angular';
import { FormsModule } from '@angular/forms';
import { WidgetsModule } from '../widgets/widgets.module';
import { RouterModule } from '@angular/router';
import { ProblemsContentComponent } from './problems-content/problems-content.component';
import { ProblemsRoutingModule } from './problems-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    ProblemsRoutingModule,
    ProblemsContentComponent,
  ],
})
export class ProblemsModule {}
