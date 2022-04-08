import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesModule } from './articles/articles.module';

const routes: Routes = [
  { path: 'articles', loadChildren: () => ArticlesModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
