import { SchlafliSymbolArticleComponent } from '../schlafli-symbol/schlafli-symbol-article.component';
import { PolyhedralDualityArticleComponent } from '../polyhedral-duality/polyhedral-duality-article.component';
import { VectorNormArticleComponent } from '../vector-norm/vector-norm-article.component';
import { DotProductArticleComponent } from '../dot-product/dot-product-article.component';
import { CrossProductArticleComponent } from '../cross-product/cross-product-article.component';
import { ScalarTripleProductArticleComponent } from '../scalar-triple-product/scalar-triple-product-article.component';
import { DihedralAngleArticleComponent } from '../dihedral-angle/dihedral-angle-article.component';
import { ComplementarySupplementaryAnglesArticleComponent } from '../complementary-supplementary-angles/complementary-supplementary-angles-article.component';
import { RadiansArticleComponent } from '../radians/radians-article.component';
import { SteradiansArticleComponent } from '../steradians/steradians-article.component';
import { HomothetyArticleComponent } from '../homothety/homothety-article.component';
import { IncirclesCircumcirclesArticleComponent } from '../incircles-circumcircles/incircles-circumcircles-article.component';
import { InspheresCircumspheresArticleComponent } from '../inspheres-circumspheres/inspheres-circumspheres-article.component';
import { PlaneNormalArticleComponent } from '../plane-normal/plane-normal-article.component';
import { ConvexHullArticleComponent } from '../convex-hull/convex-hull-article.component';
import { ApothemArticleComponent } from '../apothem/apothem-article.component';
import { BarycenterArticleComponent } from '../barycenter/barycenter-article.component';

export const GEOMETRY_FOUNDATIONS_ARTICLES = [
  SchlafliSymbolArticleComponent,
  PolyhedralDualityArticleComponent,
  VectorNormArticleComponent,
  DotProductArticleComponent,
  CrossProductArticleComponent,
  ScalarTripleProductArticleComponent,
  DihedralAngleArticleComponent,
  ComplementarySupplementaryAnglesArticleComponent,
  RadiansArticleComponent,
  SteradiansArticleComponent,
  HomothetyArticleComponent,
  IncirclesCircumcirclesArticleComponent,
  InspheresCircumspheresArticleComponent,
  PlaneNormalArticleComponent,
  ConvexHullArticleComponent,
  ApothemArticleComponent,
  BarycenterArticleComponent,
] as const;
