import { HeptagonArticleComponent } from './heptagon-article/heptagon-article.component';
import { PentagonArticleComponent } from './pentagon-article/pentagon-article.component';
import { NonagonArticleComponent } from './nonagon-article/nonagon-article.component';
import { TriangleArticleComponent } from './triangle-article/triangle-article.component';
import { SquareArticleComponent } from './square-article/square-article.component';
import { HexagonArticleComponent } from './hexagon-article/hexagon-article.component';
import { OctagonArticleComponent } from './octagon-article/octagon-article.component';

export const REGULAR_POLYGONS_ARTICLES = [
  HeptagonArticleComponent,
  HexagonArticleComponent,
  NonagonArticleComponent,
  OctagonArticleComponent,
  PentagonArticleComponent,
  SquareArticleComponent,
  TriangleArticleComponent,
] as const;
