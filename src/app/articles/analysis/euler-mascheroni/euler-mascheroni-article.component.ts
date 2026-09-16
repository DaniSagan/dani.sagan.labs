import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { HarmonicAreaComponent } from '../../../widgets/euler-mascheroni/harmonic-area.component';
import { GammaConvergenceComponent } from '../../../widgets/euler-mascheroni/gamma-convergence.component';

@Component({
  selector:'app-euler-mascheroni-article',standalone:true,
  imports:[RouterModule,FormulaComponent,HarmonicAreaComponent,GammaConvergenceComponent],
  templateUrl:'./euler-mascheroni-article.component.html',styleUrl:'./euler-mascheroni-article.component.css'
})
export class EulerMascheroniArticleComponent {
  static title='La constante de Euler–Mascheroni';
  static route='euler-mascheroni';
}
