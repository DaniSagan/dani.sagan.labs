import { AngleIdentitiesComponent } from './angle-identities.component';

describe('AngleIdentitiesComponent', () => {
  it('preserves the angle before halving and reports undefined tangent', () => {
    const component = new AngleIdentitiesComponent();
    component.mode = 'half'; component.degrees = 180;
    expect(component.target.sin).toBeCloseTo(1, 10);
    expect(component.target.tan).toBeNull();
    component.degrees = 540;
    expect(component.target.sin).toBeCloseTo(-1, 10);
    expect(component.targetAngle).toBe(270);
  });
  it('updates multiples and generated formulas', () => {
    const component = new AngleIdentitiesComponent();
    component.degrees = 45; component.order = 4;
    expect(component.targetAngle).toBe(180);
    expect(component.target.tan!).toBeCloseTo(0, 10);
    expect(component.sineFormula).toContain('4c^{3}s-4cs^{3}');
    expect(component.sineFormula).toContain(String.raw`\sin(4\theta)`);
    expect(component.tangentFormula).toContain(String.raw`\frac`);
    expect(component.format(null)).toContain('No definida');
  });
});
