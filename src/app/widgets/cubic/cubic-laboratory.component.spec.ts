import { CubicLaboratoryComponent } from './cubic-laboratory.component';
import { TestBed } from '@angular/core/testing';

describe('Cubic laboratory interactions', () => {
  it('renders every view and handles coefficient edits through the template', async () => {
    await TestBed.configureTestingModule({
      imports: [CubicLaboratoryComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CubicLaboratoryComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const coefficient = element.querySelector('input')!;
    coefficient.value = '0';
    coefficient.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    fixture.componentInstance.preset(0, -3, 1);
    for (let mode = 0; mode < 4; mode++) {
      fixture.componentInstance.mode = mode;
      fixture.detectChanges();
      expect(element.querySelector('svg')).not.toBeNull();
      expect(element.innerHTML).not.toContain('NaN');
    }
    fixture.destroy();
  });
  it('updates every view when a preset or map parameter changes', () => {
    const lab = new CubicLaboratoryComponent();
    lab.preset(0, -15, -4);
    expect(lab.error).toBe('');
    expect(lab.s.delta).toBe(-121);
    lab.setParameter('q', 2);
    expect(lab.a).toBe(1);
    expect(lab.b).toBe(0);
    expect(lab.s.q).toBe(2);
  });
  it('rejects an empty or degenerate leading coefficient', () => {
    const lab = new CubicLaboratoryComponent();
    lab.a = 0;
    lab.update();
    expect(lab.error).not.toBe('');
    lab.preset(0, -3, 2);
    expect(lab.error).toBe('');
  });
  it('exposes a Newton cycle and stops at a horizontal tangent', () => {
    const lab = new CubicLaboratoryComponent();
    lab.preset(0, -2, 2);
    lab.x0 = 0;
    lab.resetNewton();
    lab.step();
    lab.step();
    expect(lab.iterates).toEqual([0, 1, 0]);
    lab.preset(0, -3, 1);
    lab.x0 = 1;
    lab.resetNewton();
    lab.step();
    expect(lab.newtonMessage).toContain('horizontal');
  });
});
