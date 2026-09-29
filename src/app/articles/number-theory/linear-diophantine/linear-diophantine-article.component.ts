import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { DiophantineLabComponent } from '../../../widgets/diophantine/diophantine-lab.component';
import { DIOPHANTINE_EXERCISES } from './linear-diophantine-exercises';

@Component({
  selector: 'app-linear-diophantine-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    SelfAssessmentComponent,
    DiophantineLabComponent,
  ],
  templateUrl: './linear-diophantine-article.component.html',
  styleUrls: ['../gcd-euclid/gcd-euclid-article.component.css'],
})
export class LinearDiophantineArticleComponent {
  static title = 'Ecuaciones diofánticas lineales';
  static route = 'linear-diophantine-equations';
  readonly exercises = DIOPHANTINE_EXERCISES;
}
