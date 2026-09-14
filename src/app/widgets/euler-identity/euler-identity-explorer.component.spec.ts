import { TestBed } from '@angular/core/testing';
import { EulerIdentityExplorerComponent } from './euler-identity-explorer.component';
import { COMPLEX_NUMBERS_ARTICLES, COMPLEX_NUMBERS_NAV_ITEMS } from '../../articles/complex-numbers/complex-numbers-articles';
import { EulerIdentityArticleComponent } from '../../articles/complex-numbers/euler-identity/euler-identity-article.component';

describe('Euler identity explorer', () => {
  it('uses exact quarter turns and zeros only at odd half turns', () => {
    const c = new EulerIdentityExplorerComponent();
    for (const turns of [-1, 1, 3]) {
      c.turns = turns;
      expect(c.real).toBe(-1); expect(c.imaginary).toBe(0); expect(c.isZero).toBeTrue();
    }
    for (const turns of [0, 0.5, 1.5, 2]) {
      c.turns = turns; expect(c.isZero).toBeFalse();
      expect(c.real ** 2 + c.imaginary ** 2).toBe(1);
    }
    c.turns = 0.37;
    expect(c.exact).toBeFalse();
    expect(c.real ** 2 + c.imaginary ** 2).toBeCloseTo(1, 12);
    expect(c.arc).not.toMatch(/NaN|Infinity/);
  });

  it('updates the plot and result from slider and preset interactions', async () => {
    await TestBed.configureTestingModule({ imports: [EulerIdentityExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(EulerIdentityExplorerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('exactamente 0');
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('input');
    slider.value = '0.5'; slider.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.componentInstance.imaginary).toBe(1);
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('no es cero');
    fixture.nativeElement.querySelector('button').click(); fixture.detectChanges();
    expect(fixture.componentInstance.turns).toBe(-1);
    expect(fixture.nativeElement.querySelector('.sum').getAttribute('cx')).toBe('210');
    expect(fixture.nativeElement.querySelector('.sum').getAttribute('cy')).toBe('175');
    fixture.destroy();
  });

  it('registers the article for routes and navigation', () => {
    expect(COMPLEX_NUMBERS_ARTICLES).toContain(EulerIdentityArticleComponent);
    expect(COMPLEX_NUMBERS_NAV_ITEMS).toContain({ name: EulerIdentityArticleComponent.title, route: 'euler-identity' });
  });
});
