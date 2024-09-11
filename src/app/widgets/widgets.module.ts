import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas/canvas.component';
import { PrimeDecompositionComponent } from './prime-decomposition/prime-decomposition.component';
import { MathjaxModule } from 'mathjax-angular';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CanvasComponent,
    PrimeDecompositionComponent
  ],
  imports: [
    CommonModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    FormsModule
  ],
  exports: [
    CanvasComponent,
    PrimeDecompositionComponent
  ]
})
export class WidgetsModule { }
