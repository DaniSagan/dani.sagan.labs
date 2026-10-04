import { TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';
import { DiagonalizationLabComponent } from './diagonalization-lab.component';
import { ArticlesProviderServiceService } from '../../shared/content/articles-provider-service.service';
import { ALGEBRA_ARTICLES } from '../../articles/algebra/algebra-articles';
import { DiagonalizationArticleComponent } from '../../articles/algebra/diagonalization/diagonalization-article.component';

describe('Diagonalization laboratories and navigation', () => {
  it('registers the article in Algebra, the shared navigation and route collection', () => {
    expect(ALGEBRA_ARTICLES).toContain(DiagonalizationArticleComponent);
    const algebra = new ArticlesProviderServiceService().getNavbar().subsections!.find(s => s.name === 'Álgebra')!;
    expect(algebra.items).toContain({ name: DiagonalizationArticleComponent.title, route: 'matrix-diagonalization' });
  });
  it('distinguishes discovery, repeated eigenvalues, defective matrices and complex roots', () => {
    const lab = new DiagonalizationLabComponent();
    lab.showDirections = true;
    expect(lab.directions.length).toBe(2);
    lab.choose('identity');
    expect(lab.allDirections).toBeTrue();
    lab.choose('jordan');
    expect(lab.directions.length).toBe(1);
    expect(lab.decomposition).toBeNull();
    lab.choose('rotation');
    expect(lab.directions.length).toBe(0);
    expect(lab.spectrum.realDiagonalizable).toBeFalse();
    expect(lab.spectrum.complexDiagonalizable).toBeTrue();
  });
  it('verifies change of basis after reordering and powers including zero', () => {
    const lab = new DiagonalizationLabComponent();
    expect(lab.verified).toBeTrue();
    lab.reverse = true;
    expect(lab.verified).toBeTrue();
    lab.exponent = 0;
    expect(lab.powerVerified).toBeTrue();
    lab.exponent = 100;
    expect(lab.powerVerified).toBeTrue();
  });
  it('refuses invalid matrix entries and does not silently interpret zero as an eigenvector', () => {
    const lab = new DiagonalizationLabComponent();
    lab.vector = [0, 0];
    expect(lab.collinearity).toContain('no es un autovector');
    lab.update([[NaN, 0], [0, 1]]);
    expect(lab.error).not.toBe('');
    lab.choose('symmetric');
    expect(lab.error).toBe('');
  });
  it('exposes the 3D multiplicity comparison', () => {
    const lab = new DiagonalizationLabComponent();
    lab.choose3(0);
    expect(lab.spectrum.count).toBe(3);
    lab.choose3(1);
    expect(lab.spectrum.count).toBe(2);
    expect(lab.spectrum.realDiagonalizable).toBeFalse();
  });
  it('renders the progressive algebra calculation and the real/complex conclusion', async () => {
    await TestBed.configureTestingModule({ imports: [MathjaxModule.forRoot(), DiagonalizationLabComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DiagonalizationLabComponent);
    fixture.componentInstance.mode = 'algebra';
    fixture.componentInstance.choose('rotation');
    fixture.detectChanges();
    const text = () => fixture.nativeElement.textContent;
    expect(text()).not.toContain('autovectores independientes sobre ℂ');
    fixture.componentInstance.step = 4;
    fixture.detectChanges();
    expect(text()).toContain('Diagonalizable sobre ℝ: no');
    expect(text()).toContain('Sobre ℂ: sí');
    fixture.destroy();
  });
});


