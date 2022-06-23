import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ArticlesModule } from './articles/articles.module';

const routes: Routes = [
  { path: 'articles', loadChildren: () => ArticlesModule },
  { path: '', redirectTo: '/articles/home', pathMatch: 'full' },
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
