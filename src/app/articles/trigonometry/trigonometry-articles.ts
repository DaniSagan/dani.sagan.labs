import { TrigonometricEquationsArticleComponent } from './trigonometric-equations/trigonometric-equations-article.component';
import { HeightSurveyingArticleComponent } from './height-surveying/height-surveying-article.component';
import { Routes } from '@angular/router';

import { TrigNFunctionsComponent } from './trig-nfunctions/trig-nfunctions.component';
import { TrigInverseTrigCompositionComponent } from './trig-inverse-trig-composition/trig-inverse-trig-composition.component';

export const TRIGONOMETRY_ARTICLES = [
  TrigonometricEquationsArticleComponent,
  HeightSurveyingArticleComponent,
  TrigInverseTrigCompositionComponent,
  TrigNFunctionsComponent,
] as const;

// Preserve lazy loading for trigonometry articles.
export const TRIGONOMETRY_ROUTES: Routes = [
  { path: HeightSurveyingArticleComponent.route, component: HeightSurveyingArticleComponent },
  { path: TrigonometricEquationsArticleComponent.route, component: TrigonometricEquationsArticleComponent },
  {
    path: TrigInverseTrigCompositionComponent.route,
    loadComponent: () => import('./trig-inverse-trig-composition/trig-inverse-trig-composition.component').then(mod => mod.TrigInverseTrigCompositionComponent),
  },
  {
    path: TrigNFunctionsComponent.route,
    loadComponent: () => import('./trig-nfunctions/trig-nfunctions.component').then(mod => mod.TrigNFunctionsComponent),
  },
];
