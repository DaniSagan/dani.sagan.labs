import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-sampling-bias-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './sampling-bias-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class SamplingBiasArticleComponent {
  static title = "Muestreo y sesgo de selección";
  static route = 'sampling-bias';
  static description = "Distingue precisión y sesgo, diseña una muestra representativa y reconoce las condiciones de la ponderación.";

  sampleSize = 100;
  libraryWeight = 20;
  get populationMean(): number { return 1+3*Number(this.libraryWeight)/100; }
  get selectedMean(): number { return 4; }
  get bias(): number { return this.selectedMean-this.populationMean; }
  get standardError(): number { return 1/Math.sqrt(Number(this.sampleSize)); }
  get rmse(): number { return Math.sqrt(this.bias**2+this.standardError**2); }
}
