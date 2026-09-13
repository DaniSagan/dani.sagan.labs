import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { AngleIdentitiesComponent } from '../../../widgets/angle-identities/angle-identities.component';
import { AngleSumProofComponent } from '../../../widgets/angle-sum-proof/angle-sum-proof.component';

@Component({
  selector: 'app-trig-nfunctions',
  standalone: true,
  imports: [FormulaComponent, AngleIdentitiesComponent, AngleSumProofComponent],
  templateUrl: './trig-nfunctions.component.html',
  styleUrl: './trig-nfunctions.component.css'
})
export class TrigNFunctionsComponent {
  static title: string = 'Ángulos múltiples y ángulo mitad';
  static route: string = 'trig-n-functions';


}
