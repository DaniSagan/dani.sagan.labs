import { Component, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ProblemsContentComponent } from './problems-content/problems-content.component';

const routes: Routes = [
  {
    path: '',
    component: ProblemsContentComponent,
    children:
    [
      //{ path: TrigInverseTrigCompositionComponent.route, loadComponent: () => import('./trigonometry/trig-inverse-trig-composition/trig-inverse-trig-composition.component').then(mod => mod.TrigInverseTrigCompositionComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemsRoutingModule { }
