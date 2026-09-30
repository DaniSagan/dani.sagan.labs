import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { NumerationLabComponent } from '../../../widgets/numeration/numeration-lab.component';
import { SignedIntegersComponent } from '../../../widgets/numeration/signed-integers.component';
import { DivisibilityBasesComponent } from '../../../widgets/divisibility/divisibility-bases.component';
import { NUMERATION_EXERCISES } from './numeration-exercises';

@Component({
  selector: 'app-numeration-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    SelfAssessmentComponent,
    NumerationLabComponent,
    SignedIntegersComponent,
    DivisibilityBasesComponent,
  ],
  templateUrl: './numeration-article.component.html',
  styleUrls: ['../gcd-euclid/gcd-euclid-article.component.css'],
})
export class NumerationArticleComponent {
  static title = 'Sistemas de numeración y representación de enteros';
  static route = 'numeral-systems';
  readonly exercises = NUMERATION_EXERCISES;
}
