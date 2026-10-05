import { CURVE_EXAMPLES, FEATURED_EXAMPLE_IDS } from './curve-examples';
import { EXTRA_CONSTANTS, EXTRA_FUNCTIONS } from './math-catalog';
import { traceContours } from '../../widgets/implicit-curve-graph/implicit-contours';

describe('Visual curve examples', () => {
  const bindings = {
    ...Object.fromEntries(Object.getOwnPropertyNames(Math).map(name => [name, Math[name as keyof Math]])),
    ...Object.fromEntries(EXTRA_FUNCTIONS.map(entry => [entry.name, entry.fn])),
    ...Object.fromEntries(EXTRA_CONSTANTS.map(entry => [entry.name, entry.value]))
  };

  it('has unique asset names, searchable descriptions and valid featured entries', () => {
    expect(CURVE_EXAMPLES.length).toBeGreaterThan(100);
    expect(new Set(CURVE_EXAMPLES.map(example => example.id)).size).toBe(CURVE_EXAMPLES.length);
    for (const example of CURVE_EXAMPLES) {
      expect(example.id).toMatch(/^[a-z0-9-]+$/);
      expect(example.name.length).toBeGreaterThan(0);
      expect(example.description.length).toBeGreaterThan(10);
    }
    for (const id of FEATURED_EXAMPLE_IDS) expect(CURVE_EXAMPLES.some(example => example.id === id)).toBeTrue();
  });

  it('produces visible finite contours for every preset in its own framing', () => {
    for (const example of CURVE_EXAMPLES) {
      const [xmin, xmax, ymin, ymax] = example.bounds;
      expect(example.bounds.every(Number.isFinite)).toBeTrue();
      expect(xmax).toBeGreaterThan(xmin);
      expect(ymax).toBeGreaterThan(ymin);
      const fn = new Function(...Object.keys(bindings), `return (x,y)=>(${example.formula});`)(...Object.values(bindings));
      const segments = traceContours(fn, example.bounds, 96, 96);
      expect(segments.length).withContext(example.name).toBeGreaterThan(8);
      expect(segments.every(segment => segment.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))))
        .withContext(example.name).toBeTrue();
    }
  });
});
