import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { TestArticleComponent } from './test-article/test-article.component';
import { SierpinskiTriangleComponent } from './fractals/sierpinski-triangle/sierpinski-triangle.component';
import { MengerSpongeComponent } from './fractals/menger-sponge/menger-sponge.component';
import { BarnsleyFernComponent } from './fractals/barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from './fractals/dragon-curve/dragon-curve.component';
import { LorenzAttractorComponent } from './lorenz-attractor/lorenz-attractor.component';
import { DodecahedronViewerComponent } from './platonic-solids/dodecahedron-viewer/dodecahedron-viewer.component';
import { HexahedronViewerComponent } from './platonic-solids/hexahedron-viewer/hexahedron-viewer.component';
import { IcosahedronViewerComponent } from './platonic-solids/icosahedron-viewer/icosahedron-viewer.component';
import { OctahedronViewerComponent } from './platonic-solids/octahedron-viewer/octahedron-viewer.component';
import { TetrahedronViewerComponent } from './platonic-solids/tetrahedron-viewer/tetrahedron-viewer.component';
import { ArticlesContentComponent } from './articles-content/articles-content.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesContentComponent,
    children:
    [
      {path: 'sierpinski-triangle', component: SierpinskiTriangleComponent},
      {path: 'menger-sponge', component: MengerSpongeComponent},
      {path: 'barnsley-fern', component: BarnsleyFernComponent},
      {path: 'dragon-curve', component: DragonCurveComponent},
      {path: 'lorenz-attractor', component: LorenzAttractorComponent},
      {path: 'dodecahedron-viewer', component: DodecahedronViewerComponent},
      {path: 'hexahedron-viewer', component: HexahedronViewerComponent},
      {path: 'icosahedron-viewer', component: IcosahedronViewerComponent},
      {path: 'octahedron-viewer', component: OctahedronViewerComponent},
      {path: 'tetrahedron-viewer', component: TetrahedronViewerComponent},
      {path: 'test-article', component: TestArticleComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
