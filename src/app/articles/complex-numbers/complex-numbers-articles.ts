import { QuaternionsRotationsComponent } from './quaternions-rotations/quaternions-rotations.component';
import { RiemannSphereArticleComponent } from './riemann-sphere/riemann-sphere-article.component';
import { ComplexLogarithmBranchesArticleComponent } from './complex-logarithm-branches/complex-logarithm-branches-article.component';
import { ComplexResiduesArticleComponent } from './complex-residues/complex-residues-article.component';
import { HolomorphicContinuationArticleComponent } from './holomorphic-continuation/holomorphic-continuation-article.component';
import { ComplexArithmeticArticleComponent } from './complex-arithmetic/complex-arithmetic-article.component';
import { PhasorSuperpositionArticleComponent } from './phasor-superposition/phasor-superposition-article.component';
import { DeMoivreArticleComponent } from './de-moivre/de-moivre-article.component';
import { ImaginaryPowerArticleComponent } from './imaginary-power/imaginary-power-article.component';
import { EulerIdentityArticleComponent } from './euler-identity/euler-identity-article.component';
import { MobiusTransformationsArticleComponent } from './mobius-transformations/mobius-transformations-article.component';

export const COMPLEX_NUMBERS_ARTICLES = [
  QuaternionsRotationsComponent,
  RiemannSphereArticleComponent,
  ComplexLogarithmBranchesArticleComponent,
  ComplexResiduesArticleComponent,
  HolomorphicContinuationArticleComponent,
  ComplexArithmeticArticleComponent,
  PhasorSuperpositionArticleComponent,
  DeMoivreArticleComponent,ImaginaryPowerArticleComponent, EulerIdentityArticleComponent, MobiusTransformationsArticleComponent];
export const COMPLEX_NUMBERS_NAV_ITEMS = COMPLEX_NUMBERS_ARTICLES.map(article => ({ name: article.title, route: article.route }));
