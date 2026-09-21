import { TaylorSeriesArticleComponent } from './taylor-series/taylor-series-article.component';
import { FourierSeriesArticleComponent } from './fourier-series/fourier-series-article.component';
import { BrachistochroneArticleComponent } from './brachistochrone/brachistochrone-article.component';
import { NewtonRaphsonArticleComponent } from './newton-raphson/newton-raphson-article.component';

export const CALCULUS_ARTICLES = [
  TaylorSeriesArticleComponent,
  FourierSeriesArticleComponent,
  BrachistochroneArticleComponent,
  NewtonRaphsonArticleComponent,
];
export const CALCULUS_NAV_ITEMS = CALCULUS_ARTICLES.map((article) => ({
  name: article.title,
  route: article.route,
}));
