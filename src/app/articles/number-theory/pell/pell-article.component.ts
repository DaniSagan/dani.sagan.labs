import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { PellLabComponent } from '../../../widgets/pell/pell-lab.component';
import { PELL_EXERCISES } from './pell-exercises';

@Component({
  selector: 'app-pell-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    SelfAssessmentComponent,
    PellLabComponent,
  ],
  templateUrl: './pell-article.component.html',
  styleUrls: ['../gcd-euclid/gcd-euclid-article.component.css'],
})
export class PellArticleComponent {
  static title = 'Ecuación de Pell';
  static route = 'pell-equation';
  readonly exercises = PELL_EXERCISES;
}
