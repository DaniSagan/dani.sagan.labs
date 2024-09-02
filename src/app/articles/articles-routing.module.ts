import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { CvComponent } from './cv/cv.component';
import { HomeArticleComponent } from './home-article/home-article.component';
import { PrimeDecompositionArticleComponent } from './prime-decomposition-article/prime-decomposition-article.component';
import { TestArticleComponent } from './test-article/test-article.component';
import { SierpinskiTriangleComponent } from './sierpinski-triangle/sierpinski-triangle.component';
import { MengerSpongeComponent } from './menger-sponge/menger-sponge.component';
import { BarnsleyFernComponent } from './barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from './dragon-curve/dragon-curve.component';

const routes: Routes = [
  {path: 'home', component: HomeArticleComponent},
  {path: 'prime-decomposition', component: PrimeDecompositionArticleComponent},
  {path: 'sierpinski-triangle', component: SierpinskiTriangleComponent},
  {path: 'menger-sponge', component: MengerSpongeComponent},
  {path: 'barnsley-fern', component: BarnsleyFernComponent},
  {path: 'dragon-curve', component: DragonCurveComponent},
  {path: 'test-article', component: TestArticleComponent},
  {path: 'cv', component: CvComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
