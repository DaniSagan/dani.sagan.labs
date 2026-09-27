import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CrtExplorerComponent } from '../../../widgets/crt/crt-explorer.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { CRT_EXERCISES } from './crt-exercises';

@Component({
  selector: 'app-chinese-remainder-theorem',
  standalone: true,
  imports: [
    FormulaComponent,
    RouterLink,
    CrtExplorerComponent,
    SelfAssessmentComponent,
  ],
  templateUrl: './chinese-remainder-theorem.component.html',
  styleUrls: [
    '../gcd-euclid/gcd-euclid-article.component.css',
    './chinese-remainder-theorem.component.css',
  ],
})
export class ChineseRemainderTheoremComponent {
  static title = 'Sistemas de congruencias y Teorema Chino del Resto';
  static route = 'chinese-remainder-theorem';
  readonly exercises = CRT_EXERCISES;
}
