import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxModule } from 'mathjax-angular';
import { FormulaComponent } from './formula/formula.component';
import { ArithmeticDerivativeComponent } from './arithmetic-derivative/arithmetic-derivative.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormulaComponent,
    ArithmeticDerivativeComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule,
    FormsModule
  ],
  exports: [
    FormulaComponent,
    ArithmeticDerivativeComponent
  ]
})
export class MathematicsModule { }
