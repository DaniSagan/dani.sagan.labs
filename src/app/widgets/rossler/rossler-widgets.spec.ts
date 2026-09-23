import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RosslerLabComponent } from './rossler-lab.component';
import { RosslerSensitivityComponent } from './rossler-sensitivity.component';
import { RosslerBifurcationComponent } from './rossler-bifurcation.component';

describe('Rössler interactive experiments', () => {
  it('renders a canvas, changes the parameter and switches the diagnostic', async () => {
    await TestBed.configureTestingModule({
      imports: [RosslerLabComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(RosslerLabComponent);
    fixture.componentRef.setInput('c', 5.7);
    fixture.detectChanges();
    expect(fixture.componentInstance.error).toBe('');
    expect(fixture.nativeElement.querySelector('canvas').width).toBeGreaterThan(
      0,
    );
    const emitted: number[] = [];
    fixture.componentInstance.cChange.subscribe((value) => emitted.push(value));
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    buttons.find((b) => b.textContent?.trim() === 'c = 2')!.click();
    fixture.detectChanges();
    expect(emitted).toEqual([2]);
    expect(fixture.componentInstance.c).toBe(2);
    fixture.componentInstance.diagnostic = 'section';
    fixture.componentInstance.updateDiagnostic();
    fixture.detectChanges();
    expect(fixture.componentInstance.plotPoints.length).toBe(
      fixture.componentInstance.sectionCount,
    );
    expect(fixture.componentInstance.plotPoints.length).toBeGreaterThan(30);
    fixture.destroy();
  });
  it('cancels playback when parameters change or the component is destroyed', fakeAsync(() => {
    const lab = new RosslerLabComponent();
    lab.generate();
    lab.toggle();
    tick(64);
    expect(lab.running).toBeTrue();
    expect(lab.cursor).toBeGreaterThan(150);
    lab.changeC(4);
    expect(lab.running).toBeFalse();
    expect(lab.cursor).toBe(150);
    lab.toggle();
    lab.ngOnDestroy();
    const cursor = lab.cursor;
    tick(100);
    expect(lab.cursor).toBe(cursor);
    expect(lab.running).toBeFalse();
  }));
  it('recomputes the sensitivity plot when the shared parameter changes', () => {
    const widget = new RosslerSensitivityComponent();
    widget.ngOnChanges();
    const first = widget.path;
    widget.c = 2;
    widget.ngOnChanges();
    expect(widget.error).toBe('');
    expect(widget.path).not.toBe(first);
    widget.cursor = 0;
    expect(widget.current!.distance).toBeCloseTo(widget.epsilon, 12);
  });
  it('finishes the 81-column bifurcation sweep and emits selected parameters', fakeAsync(() => {
    const widget = new RosslerBifurcationComponent();
    const selected: number[] = [];
    widget.cChange.subscribe((c) => selected.push(c));
    widget.start();
    tick();
    expect(widget.error).toBe('');
    expect(widget.rows.length).toBe(81);
    expect(widget.running).toBeFalse();
    expect(widget.rows[0].c).toBe(2);
    expect(widget.rows[80].c).toBe(6);
    expect(widget.dots.every((p) => Number.isFinite(p.y))).toBeTrue();
    widget.select(4);
    expect(selected).toEqual([4]);
    expect(widget.selectedRow!.c).toBe(4);
    widget.reset();
    expect(widget.dots.length).toBe(0);
    widget.ngOnDestroy();
  }));
  it('cancels an uncompleted sweep on pause and destruction', fakeAsync(() => {
    const widget = new RosslerBifurcationComponent();
    widget.start();
    widget.pause();
    tick();
    expect(widget.rows.length).toBe(0);
    widget.start();
    widget.ngOnDestroy();
    tick();
    expect(widget.rows.length).toBe(0);
  }));
});
