import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { IntegrationLabComponent } from '../../../widgets/integration/integration-lab.component';
import {
  ADVANCED_INTEGRATION,
  CLASSICAL_INTEGRATION,
  INTEGRATION_CHAPTERS,
  IntegrationChapter,
  NUMERICAL_INTEGRATION,
} from './integration-content';

@Component({
  selector: 'app-integration-article',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    FormulaComponent,
    IntegrationLabComponent,
  ],
  templateUrl: './integration-article.component.html',
  styleUrls: ['./integration-article.component.css'],
})
export class IntegrationArticleComponent {
  @Input({ required: true }) chapter!: IntegrationChapter;
  chapters = INTEGRATION_CHAPTERS;
  situation = 'composition';
  readonly recommendations: Record<
    string,
    { text: string; route: string; fragment: string }
  > = {
    composition: {
      text: 'Busca una función interior y su derivada: prueba sustitución. Si aparece un producto y derivar uno de los factores lo simplifica, prueba por partes.',
      route: CLASSICAL_INTEGRATION.route,
      fragment: 'substitution',
    },
    rational: {
      text: 'Divide si hace falta, factoriza el denominador y usa fracciones parciales. Con raíces cuadráticas, considera sustituciones trigonométricas, hiperbólicas o de Euler.',
      route: CLASSICAL_INTEGRATION.route,
      fragment: 'rational',
    },
    definite: {
      text: 'Revisa simetrías y convergencia antes de buscar una primitiva. Un parámetro, cambiar el orden o reconocer beta y gamma puede dar un valor exacto.',
      route: ADVANCED_INTEGRATION.route,
      fragment: 'feynman',
    },
    oscillation: {
      text: 'Con una frecuencia grande, considera fase estacionaria para una aproximación asintótica, o Filon y Levin para evaluar numéricamente. Localiza primero los puntos de fase estacionaria.',
      route: NUMERICAL_INTEGRATION.route,
      fragment: 'oscillatory',
    },
    numerical: {
      text: 'En una dimensión y con función suave, empieza por una cuadratura adaptativa. Separa singularidades conocidas y contrasta al refinar. En muchas dimensiones, estudia Monte Carlo o cuasi-Monte Carlo.',
      route: NUMERICAL_INTEGRATION.route,
      fragment: 'adaptive',
    },
  };
}

@Component({
  selector: 'app-integration-classical-article',
  standalone: true,
  imports: [IntegrationArticleComponent],
  template: '<app-integration-article [chapter]="chapter" />',
})
export class IntegrationClassicalArticleComponent {
  static title = CLASSICAL_INTEGRATION.title;
  static route = CLASSICAL_INTEGRATION.route;
  chapter = CLASSICAL_INTEGRATION;
}

@Component({
  selector: 'app-integration-advanced-article',
  standalone: true,
  imports: [IntegrationArticleComponent],
  template: '<app-integration-article [chapter]="chapter" />',
})
export class IntegrationAdvancedArticleComponent {
  static title = ADVANCED_INTEGRATION.title;
  static route = ADVANCED_INTEGRATION.route;
  chapter = ADVANCED_INTEGRATION;
}

@Component({
  selector: 'app-integration-numerical-article',
  standalone: true,
  imports: [IntegrationArticleComponent],
  template: '<app-integration-article [chapter]="chapter" />',
})
export class IntegrationNumericalArticleComponent {
  static title = NUMERICAL_INTEGRATION.title;
  static route = NUMERICAL_INTEGRATION.route;
  chapter = NUMERICAL_INTEGRATION;
}
