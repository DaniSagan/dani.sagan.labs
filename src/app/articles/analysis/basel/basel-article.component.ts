import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { BaselConvergenceComponent } from '../../../widgets/basel/basel-convergence.component';
import { BaselFourierComponent } from '../../../widgets/basel/basel-fourier.component';

@Component({
  selector: 'app-basel-article',
  standalone: true,
  imports: [RouterModule, FormulaComponent, BaselConvergenceComponent, BaselFourierComponent],
  templateUrl: './basel-article.component.html',
  styleUrl: './basel-article.component.css'
})
export class BaselArticleComponent {
  static title = 'El teorema de Basilea';
  static route = 'basel';
}
