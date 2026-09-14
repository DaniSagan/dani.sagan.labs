import { binomialProbabilities, pascalRows } from './pascal.math';
import { PascalExplorerComponent } from './pascal-explorer.component';
import { PascalProbabilityComponent } from './pascal-probability.component';
import { TestBed } from '@angular/core/testing';

describe('Pascal triangle', () => {
  it('produces known coefficients and exact symmetric rows with power-of-two sums', () => {
    const rows = pascalRows(32);
    expect(rows[5]).toEqual([1, 5, 10, 10, 5, 1]);
    expect(rows[32][16]).toBe(601080390);
    rows.forEach((row, n) => {
      expect(row).toEqual([...row].reverse());
      expect(row.reduce((sum, value) => sum + value, 0)).toBe(2 ** n);
      expect(row.every(Number.isSafeInteger)).toBe(true);
    });
  });

  it('normalizes distributions and obtains the expected mean, including certain outcomes', () => {
    for (let n = 0; n <= 24; n++) {
      for (const p of [0, 0.01, 0.2, 0.5, 0.8, 0.99, 1]) {
        const probabilities = binomialProbabilities(n, p);
        expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
        expect(probabilities.reduce((sum, value, k) => sum + k * value, 0)).toBeCloseTo(n * p, 11);
        expect(probabilities.every(value => Number.isFinite(value) && value >= 0)).toBe(true);
      }
    }
    expect(binomialProbabilities(4, 0.5)[2]).toBe(0.375);
    expect(binomialProbabilities(4, 0)).toEqual([1, 0, 0, 0, 0]);
    expect(binomialProbabilities(4, 1)).toEqual([0, 0, 0, 0, 1]);
  });

  it('rejects unsupported rows and probabilities', () => {
    for (const n of [-1, 33, 2.5, NaN]) { expect(() => pascalRows(n)).toThrowError(RangeError); }
    for (const p of [-0.1, 1.1, NaN, Infinity]) { expect(() => binomialProbabilities(4, p)).toThrowError(RangeError); }
  });

  it('keeps the selection inside the visible triangle when changing modes', () => {
    const widget = new PascalExplorerComponent();
    widget.modulus = 2; widget.lastRow = 31; widget.select(31, 30);
    widget.modulus = 0; widget.update();
    expect([widget.lastRow, widget.selectedN, widget.selectedK]).toEqual([12, 12, 12]);
    widget.lastRow = 0; widget.update();
    expect(widget.value).toBe(1);
  });

  it('updates the selected coefficient and highlights its parents after a click', async () => {
    await TestBed.configureTestingModule({ imports: [PascalExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PascalExplorerComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const button = element.querySelector<HTMLButtonElement>('button[aria-label="Fila 4, posición 2: 6"]')!;
    button.click(); fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelectorAll('button.parent').length).toBe(2);
    expect(element.querySelector('.readout')!.textContent).toContain('3 + 3 = 6');
    fixture.destroy();
  });

  it('renders certain probabilities and clamps the requested number of heads', async () => {
    await TestBed.configureTestingModule({ imports: [PascalProbabilityComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PascalProbabilityComponent);
    const widget = fixture.componentInstance;
    widget.k = 20; widget.n = 3; widget.percent = 100; widget.update();
    fixture.detectChanges();
    expect(widget.k).toBe(3);
    expect((fixture.nativeElement as HTMLElement).querySelector('.readout')!.textContent).toContain('100 %');
    expect(widget.bars[3].height).toBe(200);
    fixture.destroy();
  });
});
