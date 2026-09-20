import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BifurcationDiagramComponent } from './bifurcation-diagram.component';

describe('BifurcationDiagramComponent', () => {
  let component: BifurcationDiagramComponent;
  let fixture: ComponentFixture<BifurcationDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BifurcationDiagramComponent] }).compileComponents();
    fixture = TestBed.createComponent(BifurcationDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders the explorer without change detection errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement.querySelectorAll('.preset-bar button').length).toBe(4);
  });

  it('finishes the progressive render and draws the attractor', async () => {
    const deadline = performance.now() + 10000;
    // Allow the initial resize and animation frame to start the render.
    await new Promise(resolve => setTimeout(resolve, 100));
    while (component.rendering && performance.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    expect(component.rendering).toBeFalse();
    fixture.detectChanges();
    const canvas = component.canvasRef.nativeElement;
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    let attractorPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 1] > 130 && pixels[i + 1] > pixels[i] * 1.5) attractorPixels++;
    }
    expect(attractorPixels).toBeGreaterThan(100);
  }, 15000);

  it('converges to the nonzero fixed point for r = 2.8', () => {
    component.selectR(2.8);
    expect(component.lastValue).toBeCloseTo(1 - 1 / 2.8, 6);
    expect(component.orbitPoints.split(' ').length).toBe(81);
  });

  it('keeps zoom and selection inside the logistic map domain', () => {
    for (let i = 0; i < 20; i++) component.zoom(2);
    expect(component.rMin).toBe(0);
    expect(component.rMax).toBe(4);
    expect(component.yMin).toBe(0);
    expect(component.yMax).toBe(1);
    component.selectR(9);
    expect(component.selectedR).toBe(4);
    for (let i = 0; i < 30; i++) component.zoom(0.5);
    expect(component.rMax - component.rMin).toBeGreaterThan(0.000009);
    expect(Number.isFinite(component.markerX)).toBeTrue();
  });

  it('rejects invalid bounds and excessive iteration counts without changing the view', () => {
    const original = component.rMin;
    component.draft.rMin = component.draft.rMax;
    component.applySettings();
    expect(component.error).not.toBe('');
    expect(component.rMin).toBe(original);
    component.draft.rMin = original;
    component.draft.iterations = 1000000;
    component.applySettings();
    expect(component.iterations).toBe(1000);
    expect(component.error).not.toBe('');
  });

  it('applies a preset and resets the viewport', () => {
    component.applyPreset(component.presets[3]);
    expect(component.selectedR).toBe(3.83);
    expect(component.rMin).toBe(3.82);
    component.resetView();
    expect(component.rMin).toBe(2.5);
    expect(component.rMax).toBe(4);
    expect(component.selectedR).toBe(3.7);
  });
});
