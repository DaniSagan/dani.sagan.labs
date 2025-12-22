import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';

@Component({
  selector: 'app-trig-nfunctions',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './trig-nfunctions.component.html',
  styleUrl: './trig-nfunctions.component.css'
})
export class TrigNFunctionsComponent {
  static title: string = 'Funciones trigonométricas de multiplos de ángulo';
  static route: string = 'trig-n-functions';


}
