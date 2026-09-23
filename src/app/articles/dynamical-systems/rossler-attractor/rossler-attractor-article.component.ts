import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { RosslerLabComponent } from '../../../widgets/rossler/rossler-lab.component';
import { RosslerSensitivityComponent } from '../../../widgets/rossler/rossler-sensitivity.component';
import { RosslerBifurcationComponent } from '../../../widgets/rossler/rossler-bifurcation.component';

@Component({
  selector: 'app-rossler-attractor-article',
  standalone: true,
  imports: [
    RouterModule,
    FormulaComponent,
    RosslerLabComponent,
    RosslerSensitivityComponent,
    RosslerBifurcationComponent,
  ],
  templateUrl: './rossler-attractor-article.component.html',
  styleUrl: './rossler-attractor-article.component.css',
})
export class RosslerAttractorArticleComponent {
  static title = 'El atractor de Rössler';
  static route = 'rossler-attractor';
  c = 5.7;
}
