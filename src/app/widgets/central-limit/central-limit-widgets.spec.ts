import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CentralLimitLabComponent } from './central-limit-lab.component';
import { CentralLimitBinomialComponent } from './central-limit-binomial.component';
import { CentralLimitLimitsComponent } from './central-limit-limits.component';

describe('Central limit interactive experiments', () => {
  it('renders the laboratory and responds to a sample-size preset', async () => {
    await TestBed.configureTestingModule({
      imports: [CentralLimitLabComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CentralLimitLabComponent);
    fixture.detectChanges();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons.find((button) => button.textContent?.trim() === 'n = 30')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.n).toBe(30);
    expect(fixture.nativeElement.querySelectorAll('rect').length).toBe(40);
    expect(fixture.nativeElement.textContent).toContain('1000');
    fixture.destroy();
  });
  it('replays a sample, preserves it across scale changes and resets on a new configuration', () => {
    const lab = new CentralLimitLabComponent();
    const initial = [...lab.values];
    lab.standardized = false;
    lab.draw();
    expect(lab.values).toEqual(initial);
    lab.add();
    expect(lab.values.length).toBe(1500);
    lab.reset();
    expect(lab.values).toEqual(initial);
    lab.n = 100;
    lab.reset();
    expect(lab.latest.length).toBe(100);
    expect(Math.abs(lab.sd - 0.1)).toBeLessThan(0.015);
    lab.ngOnDestroy();
  });
  it('stops a running simulation on destruction and enforces its sample cap', fakeAsync(() => {
    const lab = new CentralLimitLabComponent();
    lab.toggle();
    tick(180);
    expect(lab.values.length).toBe(1250);
    lab.ngOnDestroy();
    tick(360);
    expect(lab.values.length).toBe(1250);
    lab.add(20000);
    expect(lab.values.length).toBe(10000);
    expect(lab.running).toBeFalse();
  }));
  it('computes exact binomial events, improves the symmetric center and clamps k', () => {
    const widget = new CentralLimitBinomialComponent();
    widget.n = 40;
    widget.p = 0.5;
    widget.k = 20;
    widget.corrected = false;
    widget.update();
    const uncorrected = widget.error;
    expect(widget.exact).toBeCloseTo(0.5626853438, 9);
    widget.corrected = true;
    widget.update();
    expect(widget.error).toBeLessThan(uncorrected);
    widget.n = 5;
    widget.update();
    expect(widget.k).toBe(5);
    expect(widget.exact).toBeCloseTo(1, 12);
  });
  it('distinguishes concentration from the two counterexamples', () => {
    const widget = new CentralLimitLimitsComponent();
    expect(widget.rows[4].width).toBeLessThan(widget.rows[0].width / 8);
    widget.model = 'dependent';
    widget.compute();
    expect(widget.rows[4].width).toBeGreaterThan(1.4);
    widget.model = 'cauchy';
    widget.compute();
    expect(widget.rows[4].width).toBeGreaterThan(5);
  });
});
