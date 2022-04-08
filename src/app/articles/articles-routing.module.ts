import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestArticleComponent } from './test-article/test-article.component';

const routes: Routes = [
  {path: 'test-article', component: TestArticleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
