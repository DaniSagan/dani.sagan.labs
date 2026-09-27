import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { ModularClockComponent } from '../../../widgets/modular/modular-clock.component';
import { ResidueClassesComponent } from '../../../widgets/modular/residue-classes.component';
import { ModularTableComponent } from '../../../widgets/modular/modular-table.component';
import { ModularInverseComponent } from '../../../widgets/modular/modular-inverse.component';
import { ModularPowersComponent } from '../../../widgets/modular/modular-powers.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { MODULAR_EXERCISES } from './modular-exercises';

@Component({
  selector: 'app-modular-arithmetic-article', standalone: true,
  imports: [RouterLink, FormulaComponent, ModularClockComponent, ResidueClassesComponent,
    ModularTableComponent, ModularInverseComponent, ModularPowersComponent, SelfAssessmentComponent],
  templateUrl: './modular-arithmetic-article.component.html',
  styleUrl: '../gcd-euclid/gcd-euclid-article.component.css'
})
export class ModularArithmeticArticleComponent {
  static title = 'Congruencias: fundamentos y aritmética modular';
  static route = 'modular-arithmetic';
  readonly exercises = MODULAR_EXERCISES;
}
