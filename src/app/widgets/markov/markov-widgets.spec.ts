import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MarkovLabComponent } from './markov-lab.component';
import { MarkovMixingComponent } from './markov-mixing.component';
import { MarkovAbsorptionComponent } from './markov-absorption.component';

describe('Markov interactive laboratories', () => {
  it('renders controls and switches to a periodic chain', async () => {
    await TestBed.configureTestingModule({
      imports: [MarkovLabComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(MarkovLabComponent);
    fixture.detectChanges();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons
      .find((b) => b.textContent?.trim() === 'Ciclo determinista')!
      .click();
    fixture.detectChanges();
    expect(fixture.componentInstance.period).toBe(3);
    expect(fixture.componentInstance.path.slice(0, 4)).toEqual([0, 1, 2, 0]);
    expect(fixture.nativeElement.textContent).toContain('Período: 3');
    fixture.destroy();
  });
  it('retains the last valid matrix on an invalid edit and replays simulation seeds', () => {
    const lab = new MarkovLabComponent(),
      matrix = lab.matrix,
      empirical = lab.empirical;
    lab.weights[0] = [0, 0, 0];
    lab.apply();
    expect(lab.matrix).toBe(matrix);
    expect(lab.error).not.toBe('');
    lab.reset();
    expect(lab.empirical).toEqual(empirical);
    lab.weights = [
      [2, 1, 1],
      [1, 2, 1],
      [1, 1, 2],
    ];
    lab.apply();
    expect(lab.error).toBe('');
    expect(lab.matrix[0]).toEqual([0.5, 0.25, 0.25]);
  });
  it('cleans playback timers and pauses when applying a preset', fakeAsync(() => {
    const lab = new MarkovLabComponent();
    lab.toggle();
    tick(800);
    expect(lab.t).toBe(2);
    lab.preset('cycle');
    expect(lab.running).toBeFalse();
    expect(lab.t).toBe(0);
    lab.toggle();
    lab.ngOnDestroy();
    tick(800);
    expect(lab.t).toBe(0);
  }));
  it('handles the two-state endpoint cases and exact geometric decay', () => {
    const widget = new MarkovMixingComponent();
    widget.preset(1, 1);
    expect(widget.pi).toBe(0.5);
    expect(widget.history[1][0]).toBe(0);
    expect(widget.history[2][0]).toBe(1);
    widget.preset(0, 0);
    expect(widget.pi).toBeNull();
    expect(widget.history[80][0]).toBe(1);
    widget.preset(0.1, 0.2);
    widget.t = 10;
    expect(widget.distance!).toBeCloseTo(Math.pow(0.7, 10) / 3, 12);
  });
  it('accounts for absorbed and unfinished walks and handles an absorbing initial state', () => {
    const widget = new MarkovAbsorptionComponent();
    expect(widget.left + widget.right + widget.censored).toBe(2000);
    expect(widget.model.time[3]).toBeCloseTo(9, 12);
    expect(widget.right / 2000).toBeCloseTo(0.5, 1);
    widget.initial = 6;
    widget.compute();
    expect(widget.right).toBe(2000);
    expect(widget.meanCappedTime).toBe(0);
    expect(widget.history.every((row) => row[6] === 1)).toBeTrue();
  });
});
