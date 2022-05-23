import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxModule } from 'mathjax-angular';
import { FormulaComponent } from './formula/formula.component';


@NgModule({
  declarations: [
    FormulaComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule
  ],
  exports: [
    FormulaComponent
  ]
})
export class MathematicsModule { }
