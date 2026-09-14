import { TestBed } from '@angular/core/testing';
import { pascalRows } from '../pascal-triangle/pascal.math';
import { binomialChoices, binomialTerms } from './binomial.math';
import { BinomialChoicesComponent } from './binomial-choices.component';
import { BinomialExplorerComponent } from './binomial-explorer.component';

describe('Binomial theorem widgets', () => {
  it('matches direct exponentiation exactly throughout the supported controls', () => {
    for (let n = 0; n <= 10; n++) {
      for (let a = -3; a <= 3; a++) {
        for (let b = -3; b <= 3; b++) {
          const terms = binomialTerms(n, a, b);
          expect(terms.reduce((sum, term) => sum + term.value, 0)).toBe((a + b) ** n);
          expect(terms.every(term => Number.isSafeInteger(term.value))).toBe(true);
        }
      }
    }
  });

  it('counts every choice once and groups it by its number of b letters', () => {
    for (let n = 1; n <= 6; n++) {
      const row = pascalRows(n)[n];
      const all: string[] = [];
      for (let k = 0; k <= n; k++) {
        const choices = binomialChoices(n, k);
        expect(choices.length).toBe(row[k]);
        expect(choices.every(word => word.length === n && word.split('b').length - 1 === k)).toBe(true);
        all.push(...choices);
      }
      expect(new Set(all).size).toBe(2 ** n);
    }
  });

  it('rejects inputs outside the exact calculation limits', () => {
    expect(() => binomialTerms(11, 1, 1)).toThrowError(RangeError);
    expect(() => binomialTerms(2, NaN, 1)).toThrowError(RangeError);
    expect(() => binomialTerms(2, 1, 0.5)).toThrowError(RangeError);
    expect(() => binomialChoices(7, 2)).toThrowError(RangeError);
    expect(() => binomialChoices(3, 4)).toThrowError(RangeError);
  });

  it('keeps the zero-exponent view finite and clamps its selected term', async () => {
    await TestBed.configureTestingModule({ imports: [BinomialExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BinomialExplorerComponent);
    const widget = fixture.componentInstance;
    widget.n = 0; widget.a = 0; widget.b = 0; widget.update();
    fixture.detectChanges();
    expect(widget.k).toBe(0);
    expect(widget.sum).toBe(1);
    expect(widget.bars[0].height).toBe(105);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('NaN');
    fixture.destroy();
  });

  it('renders negative contributions below the zero axis', () => {
    const widget = new BinomialExplorerComponent();
    widget.a = 1; widget.b = -1;
    expect(widget.sum).toBe(0);
    expect(widget.bars.filter(bar => bar.value < 0).every(bar => bar.y === 140 && bar.height > 0)).toBe(true);
  });

  it('updates grouped choices when a factor is toggled and preserves valid factors on resize', async () => {
    await TestBed.configureTestingModule({ imports: [BinomialChoicesComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BinomialChoicesComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('.factors button')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.word).toBe('babb');
    expect(element.querySelectorAll('.choices button').length).toBe(4);
    fixture.componentInstance.n = 1; fixture.componentInstance.update(); fixture.detectChanges();
    expect(fixture.componentInstance.word).toBe('b');
    expect(element.querySelectorAll('.factors button').length).toBe(1);
    fixture.destroy();
  });
});
