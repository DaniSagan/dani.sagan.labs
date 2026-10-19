import { ANECDOTES_NAV_ITEMS } from 'src/app/articles/anecdotes/anecdotes-articles';
import { Injectable } from '@angular/core';
import { ALGEBRA_NAV_ITEMS } from 'src/app/articles/algebra/algebra-articles';
import { ANALYSIS_NAV_ITEMS } from 'src/app/articles/analysis/analysis-articles';
import { CALCULUS_NAV_ITEMS } from 'src/app/articles/calculus/calculus-articles';
import { COMBINATORICS_NAV_ITEMS } from 'src/app/articles/combinatorics/combinatorics-articles';
import { COMPLEX_NUMBERS_NAV_ITEMS } from 'src/app/articles/complex-numbers/complex-numbers-articles';
import { CURVES_ARTICLES } from 'src/app/articles/curves/curves-articles';
import { DYNAMICAL_SYSTEMS_NAV_ITEMS } from 'src/app/articles/dynamical-systems/dynamical-systems-articles';
import { FRACTALS_ARTICLES } from 'src/app/articles/fractals/fractals-articles';
import { GEOMETRY_ARTICLES } from 'src/app/articles/geometry/geometry-articles';
import { NUMBER_THEORY_NAV_ITEMS } from 'src/app/articles/number-theory/number-theory-articles';
import { PLATONIC_SOLIDS_ARTICLES } from 'src/app/articles/platonic-solids/platonic-solids-articles';
import { PROBABILITY_ARTICLES } from 'src/app/articles/probability/probability-articles';
import { REGULAR_POLYGONS_ARTICLES } from 'src/app/articles/regular-polygons/regular-polygons-articles';
import { TestArticleComponent } from 'src/app/articles/test-article/test-article.component';
import { TOPOLOGY_NAV_ITEMS } from 'src/app/articles/topology/topology-articles';
import { TRIGONOMETRY_ARTICLES } from 'src/app/articles/trigonometry/trigonometry-articles';
import { groupArticleItems } from './article-navigation-groups';
import { NavbarItem } from './navbar-item';
import { NavbarProvider } from './navbar-provider';
import { Navbar } from './navbar';

// Use the same catalogues as the router, including articles added in the future.
function articleItems(articles: readonly { title: string; route: string }[]): NavbarItem[] {
  return articles.map(article => ({ name: article.title, route: article.route }));
}

@Injectable({ providedIn: 'root' })
export class ArticlesProviderServiceService extends NavbarProvider {
  map: NavbarItem[] = [];
  fractals = articleItems(FRACTALS_ARTICLES);
  regularPolygons = articleItems(REGULAR_POLYGONS_ARTICLES);
  platonicSolids = articleItems(PLATONIC_SOLIDS_ARTICLES);
  numericTheory: NavbarItem[] = [...NUMBER_THEORY_NAV_ITEMS];
  curves = articleItems(CURVES_ARTICLES);
  geometry = articleItems(GEOMETRY_ARTICLES);
  probability = articleItems(PROBABILITY_ARTICLES);
  trigonometry = articleItems(TRIGONOMETRY_ARTICLES);
  others: NavbarItem[] = [{ name: TestArticleComponent.title, route: TestArticleComponent.route }];

  override getNavbar(): Navbar {
    const result = new Navbar();
    result.name = 'Artículos';
    result.subsections = [
      { name: 'Mapa', items: this.map },
      { name: 'Anécdotas matemáticas', items: ANECDOTES_NAV_ITEMS },
      { name: 'Fractales', items: [], subsections: groupArticleItems(this.fractals, 'fractals') },
      { name: 'Polígonos Regulares', items: this.regularPolygons },
      { name: 'Sólidos Platónicos', items: this.platonicSolids },
      { name: 'Teoría de Números', items: [], subsections: groupArticleItems(this.numericTheory, 'numbers') },
      { name: 'Álgebra', items: [], subsections: groupArticleItems(ALGEBRA_NAV_ITEMS, 'algebra') },
      { name: 'Combinatoria', items: [], subsections: groupArticleItems(COMBINATORICS_NAV_ITEMS, 'combinatorics') },
      { name: 'Análisis Matemático', items: [], subsections: groupArticleItems(ANALYSIS_NAV_ITEMS, 'analysis') },
      { name: 'Cálculo', items: [], subsections: groupArticleItems(CALCULUS_NAV_ITEMS, 'calculus') },
      { name: 'Sistemas dinámicos', items: DYNAMICAL_SYSTEMS_NAV_ITEMS },
      { name: 'Topología', items: TOPOLOGY_NAV_ITEMS },
      { name: 'Números complejos', items: COMPLEX_NUMBERS_NAV_ITEMS },
      { name: 'Geometría', items: [], subsections: groupArticleItems(this.geometry, 'geometry') },
      { name: 'Curvas', items: [], subsections: groupArticleItems(this.curves, 'curves') },
      { name: 'Probabilidad', items: [], subsections: groupArticleItems(this.probability, 'probability') },
      { name: 'Trigonometría', items: this.trigonometry },
      { name: 'Otros', items: this.others },
    ];
    return result;
  }
}
