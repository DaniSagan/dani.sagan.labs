import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeArticleComponent } from './home-article/home-article.component';

const routes: Routes = [
  {
    path: '',
    component: HomeArticleComponent,
    children:
    [
      // {path: 'home', component: HomeArticleComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
