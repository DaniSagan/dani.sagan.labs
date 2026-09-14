import { TestBed } from '@angular/core/testing';
import { ComplexExponentialComponent } from './complex-exponential.component';
import { ImaginaryPowerBranchesComponent } from './imaginary-power-branches.component';
import { ArticlesProviderServiceService } from '../../shared/content/articles-provider-service.service';
import { ImaginaryPowerArticleComponent } from '../../articles/complex-numbers/imaginary-power/imaginary-power-article.component';

describe('imaginary power visualizations', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ComplexExponentialComponent, ImaginaryPowerBranchesComponent] }).compileComponents();
  });

  it('switches from i to the real principal power using the preset button', () => {
    const fixture = TestBed.createComponent(ComplexExponentialComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    expect(c.real).toBeCloseTo(0, 12);
    expect(c.imaginary).toBeCloseTo(1, 12);
    fixture.nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();
    expect(c.real).toBeCloseTo(0.20787957635076193, 12);
    expect(c.imaginary).toBe(0);
    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-label')).toContain('parte imaginaria 0');
    fixture.destroy();
  });

  it('updates the exponential from the slider and keeps extreme points visible', () => {
    const fixture = TestBed.createComponent(ComplexExponentialComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('input');
    slider.value = '2'; slider.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(c.a).toBe(2);
    expect(c.radius).toBeCloseTo(Math.exp(2), 12);
    for (const a of [-3, 2]) for (const b of [-Math.PI, 0, Math.PI]) {
      c.a = a; c.b = b;
      expect(Math.abs(c.real * c.unit)).toBeLessThanOrEqual(110);
      expect(Math.abs(c.imaginary * c.unit)).toBeLessThanOrEqual(110);
    }
    fixture.destroy();
  });

  it('selects branches with the slider and preserves the geometric ratio', () => {
    const fixture = TestBed.createComponent(ImaginaryPowerBranchesComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('input');
    slider.value = '-1'; slider.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(c.k).toBe(-1);
    expect(c.value(c.k)).toBeCloseTo(111.31777848985621, 10);
    expect(fixture.nativeElement.querySelector('tr.active').textContent).toContain('-1');
    for (const k of c.branches) {
      expect(c.value(k)).toBeGreaterThan(0);
      expect(c.value(k + 1) / c.value(k)).toBeCloseTo(Math.exp(-2 * Math.PI), 12);
      expect(Math.cos(c.angle(k))).toBeCloseTo(0, 12);
      expect(Math.sin(c.angle(k))).toBeCloseTo(1, 12);
    }
    fixture.nativeElement.querySelector('button').click(); fixture.detectChanges();
    expect(c.k).toBe(0);
    fixture.destroy();
  });

  it('exposes the article in its own navigation category', () => {
    const navbar = TestBed.inject(ArticlesProviderServiceService).getNavbar();
    const category = navbar.subsections?.find(section => section.name === 'Números complejos');
    expect(category?.items).toContain({ name: ImaginaryPowerArticleComponent.title, route: ImaginaryPowerArticleComponent.route });
  });
});
