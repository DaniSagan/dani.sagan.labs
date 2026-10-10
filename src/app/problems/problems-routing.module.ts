import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemsContentComponent } from './problems-content/problems-content.component';
import { PROBLEMS, PROBLEM_COMPONENTS } from './problems.data';
import { PROBLEM_LIST } from './shared/problem-navigation.component';

const routes: Routes = [
  {
    path: '',
    component: ProblemsContentComponent,
    providers: [{ provide: PROBLEM_LIST, useValue: PROBLEMS }],
    children: [
      { path: '', pathMatch: 'full', title: 'Problemas de matemáticas · DaniSagan Labs', loadComponent: () => import('./problems-intro/problems-intro.component').then(m => m.ProblemsIntroComponent) },
      ...PROBLEM_COMPONENTS.map(problem => ({
        path: problem.route,
        component: problem,
        title: `${problem.title} · DaniSagan Labs`,
      })),
      { path: '**', title: 'Problema no encontrado · DaniSagan Labs', loadComponent: () => import('./shared/problem-not-found.component').then(m => m.ProblemNotFoundComponent) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProblemsRoutingModule {}
