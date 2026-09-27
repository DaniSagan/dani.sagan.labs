import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { DivisibilityLabComponent } from '../../../widgets/divisibility/divisibility-lab.component';
import { CriterionDiscoveryComponent } from '../../../widgets/divisibility/criterion-discovery.component';
import { DivisibilityBasesComponent } from '../../../widgets/divisibility/divisibility-bases.component';
import { DIVISIBILITY_EXERCISES } from './divisibility-exercises';

@Component({
  selector: 'app-divisibility-rules-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    SelfAssessmentComponent,
    DivisibilityLabComponent,
    CriterionDiscoveryComponent,
    DivisibilityBasesComponent,
  ],
  templateUrl: './divisibility-rules-article.component.html',
  styleUrls: [
    '../gcd-euclid/gcd-euclid-article.component.css',
    './divisibility-rules-article.component.css',
  ],
})
export class DivisibilityRulesArticleComponent {
  static title = 'Criterios de divisibilidad';
  static route = 'divisibility-rules';
  readonly exercises = DIVISIBILITY_EXERCISES;
}
