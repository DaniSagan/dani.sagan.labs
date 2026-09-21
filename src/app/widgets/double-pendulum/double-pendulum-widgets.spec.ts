import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  DEFAULT_PENDULUM,
  pendulumEnergy,
} from '../../shared/math/double-pendulum';
import { DoublePendulumLabComponent } from './double-pendulum-lab.component';
import { DoublePendulumModesComponent } from './double-pendulum-modes.component';
import { DoublePendulumSectionComponent } from './double-pendulum-section.component';

describe('Double pendulum widgets', () => {
  it('starts paused, advances reproducibly and resets all comparison trajectories', () => {
    TestBed.configureTestingModule({ imports: [DoublePendulumLabComponent] });
    const fixture = TestBed.createComponent(DoublePendulumLabComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    expect(c.running).toBe(false);
    c.epsilon = 0;
    c.reset();
    c.singleStep();
    expect(c.time).toBeCloseTo(1 / 30, 12);
    expect(c.separation).toBe(0);
    for (const tab of ['energy', 'separation', 'phase']) {
      c.tab = tab;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    }
    const snapshot = [...c.state];
    c.reset();
    c.singleStep();
    expect(c.state).toEqual(snapshot);
    c.frequency = 480;
    c.reset();
    expect(c.time).toBe(0);
    expect(c.samples.length).toBe(1);
    fixture.destroy();
  });
  it('cancels animation when paused and destroyed', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [DoublePendulumLabComponent] });
    const fixture = TestBed.createComponent(DoublePendulumLabComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    c.play();
    tick(100);
    expect(c.time).toBeGreaterThan(0);
    c.pause();
    const time = c.time;
    tick(100);
    expect(c.time).toBe(time);
    c.play();
    fixture.destroy();
    expect(c.running).toBe(false);
    tick(100);
  }));
  it('compares modes from the identical initial state and updates the selected time', () => {
    TestBed.configureTestingModule({ imports: [DoublePendulumModesComponent] });
    const fixture = TestBed.createComponent(DoublePendulumModesComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    expect(c.difference).toBe(0);
    c.time = 20;
    fixture.detectChanges();
    expect(c.difference).toBeGreaterThan(0);
    c.preset(1);
    fixture.detectChanges();
    expect(c.time).toBe(0);
    expect(c.difference).toBe(0);
    expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    fixture.destroy();
  });
  it('uses equal-energy seeds, completes a section and clears stale points after edits', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DoublePendulumSectionComponent],
    });
    const fixture = TestBed.createComponent(DoublePendulumSectionComponent);
    const c = fixture.componentInstance;
    c.duration = 3;
    fixture.detectChanges();
    tick(3000);
    expect(c.progress).toBe(100);
    expect(c.running).toBe(false);
    expect(c.points.length).toBeGreaterThan(0);
    c.initialStates.forEach((s) =>
      expect(pendulumEnergy(s, DEFAULT_PENDULUM).total).toBeCloseTo(
        c.energyLevel * 9.81,
        10,
      ),
    );
    c.energyLevel = 0.5;
    c.configure();
    expect(c.points.length).toBe(0);
    expect(c.progress).toBe(0);
    c.start();
    c.stop();
    expect(c.running).toBe(false);
    fixture.destroy();
    tick(100);
  }));
});
