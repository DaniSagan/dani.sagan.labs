import { SphericalTrigonometryArticleComponent } from './spherical-trigonometry/spherical-trigonometry-article.component';
import { SineLawArticleComponent } from './sine-law/sine-law-article.component';
import { TrigonometricEquationsArticleComponent } from './trigonometric-equations/trigonometric-equations-article.component';
import { HeightSurveyingArticleComponent } from './height-surveying/height-surveying-article.component';
import { TrigonometricAtlasComponent } from './trigonometric-atlas/trigonometric-atlas.component';
import { Routes } from '@angular/router';

import { TrigNFunctionsComponent } from './trig-nfunctions/trig-nfunctions.component';
import { TrigInverseTrigCompositionComponent } from './trig-inverse-trig-composition/trig-inverse-trig-composition.component';

export const TRIGONOMETRY_ARTICLES = [
  TrigonometricAtlasComponent,
  SphericalTrigonometryArticleComponent,
  SineLawArticleComponent,
  TrigonometricEquationsArticleComponent,
  HeightSurveyingArticleComponent,
  TrigInverseTrigCompositionComponent,
  TrigNFunctionsComponent,
] as const;

// Preserve lazy loading for trigonometry articles.
export const TRIGONOMETRY_ROUTES: Routes = [
  { path: TrigonometricAtlasComponent.route, loadComponent: () => import('./trigonometric-atlas/trigonometric-atlas.component').then(mod => mod.TrigonometricAtlasComponent) },
  { path: SphericalTrigonometryArticleComponent.route, component: SphericalTrigonometryArticleComponent },
  { path: SineLawArticleComponent.route, component: SineLawArticleComponent },
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
