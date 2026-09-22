import { TestBed } from '@angular/core/testing';
import { DeterminantPlaneComponent } from './determinant-plane.component';
import { DeterminantVolumeComponent } from './determinant-volume.component';
import { DeterminantExpansionComponent } from './determinant-expansion.component';
import { DeterminantEliminationComponent } from './determinant-elimination.component';

describe('Determinant widgets', () => {
  it('updates the plane from matrix inputs and blocks empty values', () => {
    TestBed.configureTestingModule({ imports: [DeterminantPlaneComponent] });
    const fixture = TestBed.createComponent(DeterminantPlaneComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance,
      input: HTMLInputElement =
        fixture.nativeElement.querySelector('input[type=number]');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(c.valid).toBe(false);
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    c.preset('rotation');
    c.t = 0.5;
    fixture.detectChanges();
    expect(c.det).toBe(0);
    c.preset('area');
    c.composition = 'reflection';
    fixture.detectChanges();
    expect(c.det).toBe(-2);
    expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    fixture.destroy();
  });
  it('rotates the volume view without changing its determinant', () => {
    TestBed.configureTestingModule({ imports: [DeterminantVolumeComponent] });
    const fixture = TestBed.createComponent(DeterminantVolumeComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance,
      before = c.points(c.faceIndices[0]);
    c.yaw = 120;
    c.pitch = -40;
    fixture.detectChanges();
    expect(c.points(c.faceIndices[0])).not.toBe(before);
    expect(c.det).toBe(1);
    c.preset('flat');
    fixture.detectChanges();
    expect(c.volume).toBe(0);
    fixture.destroy();
  });
  it('expands along every row and tracks the selected minor', () => {
    TestBed.configureTestingModule({
      imports: [DeterminantExpansionComponent],
    });
    const fixture = TestBed.createComponent(DeterminantExpansionComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    c.mode = 'cofactors';
    for (let i = 0; i < 3; i++) {
      c.pick(i, 1);
      fixture.detectChanges();
      expect(c.contributions.reduce((a, b) => a + b, 0)).toBe(c.det);
    }
    c.preset(true);
    fixture.detectChanges();
    expect(c.valid).toBe(true);
    expect(c.det).toBe(0);
    fixture.destroy();
  });
  it('renders exact row operations and resets stale steps after invalid input', () => {
    TestBed.configureTestingModule({
      imports: [DeterminantEliminationComponent],
    });
    const fixture = TestBed.createComponent(DeterminantEliminationComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    expect(c.steps.some((s) => s.description.includes('Intercambiar'))).toBe(
      true,
    );
    for (let i = 0; i < c.steps.length; i++) {
      c.index = i;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    }
    expect(c.recovered).toBe(c.originalDet);
    c.update([
      [NaN, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
    fixture.detectChanges();
    expect(c.steps.length).toBe(0);
    c.preset('singular');
    fixture.detectChanges();
    expect(c.index).toBe(0);
    expect(c.originalDet).toBe('0');
    fixture.destroy();
  });
});
