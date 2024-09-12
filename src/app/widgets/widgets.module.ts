import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas/canvas.component';
import { PrimeDecompositionComponent } from './prime-decomposition/prime-decomposition.component';
import { MathjaxModule } from 'mathjax-angular';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { FormsModule } from '@angular/forms';
import { ArithmeticDerivativeComponent } from './arithmetic-derivative/arithmetic-derivative.component';

@NgModule({
  declarations: [
    CanvasComponent,
    PrimeDecompositionComponent,
    ArithmeticDerivativeComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    FormsModule
  ],
  exports: [
    CanvasComponent,
    PrimeDecompositionComponent,
    ArithmeticDerivativeComponent
  ]
})
export class WidgetsModule { }
