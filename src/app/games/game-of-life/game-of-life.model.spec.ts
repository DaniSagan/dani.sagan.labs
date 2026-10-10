import {
  fitLifeView,
  normalizedLifeSearch,
  zoomLifeView,
} from './game-of-life.model';

describe('Life camera and catalogue search', () => {
  it('keeps the world point under the pointer fixed while zooming', () => {
    const view = {
      x: 1e12,
      y: -1e12,
      scale: 8,
      width: 800,
      height: 500,
      ratio: 2,
    };
    const zoomed = zoomLifeView(view, 2, 600, 150);
    expect(zoomed.x + (600 - 400) / zoomed.scale).toBe(
      view.x + (600 - 400) / view.scale,
    );
    expect(zoomed.y + (150 - 250) / zoomed.scale).toBe(
      view.y + (150 - 250) / view.scale,
    );
  });
  it('fits a sparse trillion-cell extent without clipping or imposing a dense-grid limit', () => {
    const view = fitLifeView(
      { left: -1e12, right: 1e12, top: -1e12, bottom: 1e12 },
      800,
      500,
    );
    expect(view.scale * (2e12 + 1)).toBeLessThanOrEqual(500);
    expect(view.x).toBe(0.5);
    expect(view.y).toBe(0.5);
  });
  it('searches Spanish names without distinguishing accents or capitalization', () => {
    expect(normalizedLifeSearch('CAÑÓN de Planeadores')).toBe(
      'canon de planeadores',
    );
  });
});
