import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphableFunction, ImplicitCurveGraphComponent } from './implicit-curve-graph.component';
import { Vec2 } from 'src/app/shared/math/vec2';

describe('ImplicitCurveGraphComponent', () => {
  let component: ImplicitCurveGraphComponent;
  let fixture: ComponentFixture<ImplicitCurveGraphComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImplicitCurveGraphComponent] }).compileComponents();
    fixture = TestBed.createComponent(ImplicitCurveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());
  it('round trips coordinates and rejects invalid bounds without changing the view', () => {
    component.setBounds(-3, 7, -5, 9);
    const point = component.pixelToXY(component.xyToPixel(new Vec2(2, 4)));
    expect(point.x).toBeCloseTo(2); expect(point.y).toBeCloseTo(4);
    expect(() => component.setBounds(1, 1, -1, 1)).toThrow();
    expect(() => component.setBounds(-Infinity, 1, -1, 1)).toThrow();
    expect(component.xMin).toBe(-3);
  });
  it('shows values and subdivisions by default and formats fractional ticks', () => {
    const labels = spyOn(component.context, 'fillText');
    component.drawGraph();
    expect(labels).toHaveBeenCalled();
    expect(component.showGrid).toBeTrue();
    expect(component.showSubdivisions).toBeTrue();
    expect(component.formatValue(-0.25, 0.25)).toBe('-0,25');
    expect(component.formatValue(-1e-15, 0.25)).toBe('0');
  });
  it('uses custom background colors and can hide grid, axes and values', () => {
    component.backgroundColor = '#123456';
    component.showGrid = component.showAxes = component.showLabels = false;
    component.drawGraph();
    expect(Array.from(component.context.getImageData(10,10,1,1).data)).toEqual([18,52,86,255]);
  });
  it('keeps overlays and avoids re-evaluating curves when only colors change', () => {
    const fn = jasmine.createSpy('function').and.callFake((x:number,y:number)=>x*x+y*y-1);
    component.functions=[new GraphableFunction(fn,'red')];
    component.drawGraph();
    const overlay=jasmine.createSpy('overlay'); component.draw(overlay);
    const evaluations=fn.calls.count();
    component.backgroundColor='#ffffff'; component.redraw();
    expect(fn.calls.count()).toBe(evaluations);
    expect(overlay).toHaveBeenCalledTimes(2);
    component.drawGraph(); component.redraw();
    expect(overlay).toHaveBeenCalledTimes(2);
  });
  it('preserves parametric drawings when settings or the viewport change', () => {
    const overlay=jasmine.createSpy('parametric');
    component.clear(); component.drawAxes(); component.draw(overlay);
    component.zoom(0.5); component.resetView();
    expect(overlay).toHaveBeenCalledTimes(3);
  });
  it('zooms and restores the article bounds', () => {
    component.setBounds(-2,2,-4,4); component.zoom(0.5);
    expect(component.xMax-component.xMin).toBe(2);
    component.resetView(); expect(component.xMin).toBe(-2); expect(component.yMax).toBe(4);
  });
  it('reports evaluation errors without throwing or losing the controls', () => {
    component.functions=[new GraphableFunction(()=>{throw new Error('bad formula');},'red')];
    expect(()=>component.drawGraph()).not.toThrow();
    expect(component.message).toContain('No se pudo evaluar');
  });
});
