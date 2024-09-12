import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathjaxModule } from 'mathjax-angular';
import { FormulaComponent } from './formula/formula.component';
import { FormsModule } from '@angular/forms';
import { PythagorasComponent } from './pythagoras/pythagoras.component';


@NgModule({
  declarations: [
    FormulaComponent,
    PythagorasComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule,
    FormsModule
  ],
  exports: [
    FormulaComponent
  ]
})
export class MathematicsModule { }
