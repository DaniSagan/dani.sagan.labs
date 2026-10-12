import { MathLabComponent } from './math-lab.component';
import { MathLabDefinition, MathLabResult } from './math-lab.model';

describe('MathLabComponent', () => {
  const result = (): MathLabResult => ({
    series: [], bounds: [0, 1, 0, 1], rows: [],
    description: 'Caller-provided plot', xLabel: 'u', yLabel: 'v',
  });
  const definition = (count: number): MathLabDefinition => ({
    title: 'An independent experiment', prompt: 'Explore the parameters', expression: 'u+v',
    controls: Array.from({ length: count }, (_, index) => ({
      label: 'Parameter ' + index, min: 0, max: 10, step: 1, value: index + 1,
    })),
    calculate: () => result(),
  });

  it('accepts different numbers of controls without topic registration', () => {
    const component = new MathLabComponent();
    for (const count of [0, 1, 3]) {
      component.definition = definition(count);
      const calculate = spyOn(component.definition, 'calculate').and.callThrough();
      component.ngOnChanges();
      expect(calculate).toHaveBeenCalledWith(Array.from({ length: count }, (_, index) => index + 1));
      expect(component.title).toBe(component.definition.title);
      expect(component.result.description).toBe('Caller-provided plot');
    }
  });

  it('isolates mutable controls between instances and restores caller defaults', () => {
    const sharedDefinition = definition(1);
    const first = new MathLabComponent(), second = new MathLabComponent();
    first.definition = second.definition = sharedDefinition;
    first.ngOnChanges(); second.ngOnChanges();
    first.controls[0].value = 8;
    first.update();
    expect(second.controls[0].value).toBe(1);
    expect(sharedDefinition.controls[0].value).toBe(1);
    first.reset();
    expect(first.controls[0].value).toBe(1);
  });

  it('clamps invalid input and preserves caller results when adjusting aspect ratio', () => {
    const component = new MathLabComponent();
    const originalResult = result();
    component.definition = { ...definition(3), equalAspectRatio: true, calculate: () => originalResult };
    component.ngOnChanges();
    component.controls[0].value = NaN;
    component.controls[1].value = 20;
    component.controls[2].value = 3.2;
    component.update();
    expect(component.controls.map(control => control.value)).toEqual([1, 10, 3]);
    expect(originalResult.bounds).toEqual([0, 1, 0, 1]);
    const [xmin, xmax, ymin, ymax] = component.result.bounds;
    expect((xmax - xmin) / (ymax - ymin)).toBeCloseTo(624 / 284, 12);
  });
});
