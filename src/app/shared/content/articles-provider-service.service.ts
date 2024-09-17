import { Injectable } from '@angular/core';
import { NavbarItem } from './navbar-item';
import { NavbarProvider } from './navbar-provider';
import { Navbar } from './navbar';
import { SierpinskiTriangleComponent } from 'src/app/articles/fractals/sierpinski-triangle/sierpinski-triangle.component';
import { SierpinskiCarpetComponent } from 'src/app/articles/fractals/sierpinski-carpet/sierpinski-carpet.component';
import { BarnsleyFernComponent } from 'src/app/articles/fractals/barnsley-fern/barnsley-fern.component';
import { DragonCurveComponent } from 'src/app/articles/fractals/dragon-curve/dragon-curve.component';
import { TetrahedronViewerComponent } from 'src/app/articles/platonic-solids/tetrahedron-viewer/tetrahedron-viewer.component';
import { HexahedronViewerComponent } from 'src/app/articles/platonic-solids/hexahedron-viewer/hexahedron-viewer.component';
import { OctahedronViewerComponent } from 'src/app/articles/platonic-solids/octahedron-viewer/octahedron-viewer.component';
import { DodecahedronViewerComponent } from 'src/app/articles/platonic-solids/dodecahedron-viewer/dodecahedron-viewer.component';
import { IcosahedronViewerComponent } from 'src/app/articles/platonic-solids/icosahedron-viewer/icosahedron-viewer.component';
import { ArithmeticDerivativeArticleComponent } from 'src/app/articles/number-theory/arithmetic-derivative/arithmetic-derivative-article.component';
import { LorenzAttractorComponent } from 'src/app/articles/lorenz-attractor/lorenz-attractor.component';
import { TestArticleComponent } from 'src/app/articles/test-article/test-article.component';

@Injectable({
  providedIn: 'root'
})
export class ArticlesProviderServiceService extends NavbarProvider {

  map: NavbarItem[] = [];

  fractals: NavbarItem[] =
  [
    { name: SierpinskiTriangleComponent.title, route: SierpinskiTriangleComponent.route },
    { name: SierpinskiCarpetComponent.title, route: SierpinskiCarpetComponent.route },
    { name: BarnsleyFernComponent.title, route: BarnsleyFernComponent.route },
    { name: DragonCurveComponent.title, route: DragonCurveComponent.route }
  ];

  platonicSolids: NavbarItem[] =
  [
    { name: TetrahedronViewerComponent.title, route: TetrahedronViewerComponent.route },
    { name: HexahedronViewerComponent.title, route: HexahedronViewerComponent.route },
    { name: OctahedronViewerComponent.title, route: OctahedronViewerComponent.route },
    { name: DodecahedronViewerComponent.title, route: DodecahedronViewerComponent.route },
    { name: IcosahedronViewerComponent.title, route: IcosahedronViewerComponent.route }
  ];

  numericTheory: NavbarItem[] =
  [
    { name: ArithmeticDerivativeArticleComponent.title, route: ArithmeticDerivativeArticleComponent.route }
  ];

  others: NavbarItem[] =
  [
    { name: TestArticleComponent.title, route: TestArticleComponent.route },
    { name: LorenzAttractorComponent.title, route: LorenzAttractorComponent.route }
  ];

  override getNavbar(): Navbar {
    let result: Navbar = new Navbar();
    result.name = 'Artículos';
    result.subsections = [
      { name: 'Mapa', items: this.map },
      { name: 'Fractales', items: this.fractals },
      { name: 'Sólidos Platónicos', items: this.platonicSolids },
      { name: 'Teoría de Números', items: this.numericTheory },
      { name: 'Otros', items: this.others }
    ];
    return result;
  }
}
