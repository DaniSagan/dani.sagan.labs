import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ImplicitCurveGraphToolComponent } from './implicit-curve-graph-tool.component';

describe('ImplicitCurveGraphToolComponent', () => {
  let component: ImplicitCurveGraphToolComponent;
  let fixture: ComponentFixture<ImplicitCurveGraphToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplicitCurveGraphToolComponent, MathjaxModule.forRoot(), NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImplicitCurveGraphToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('evaluates parameters, preserves settings and leaves the explored view intact', () => {
    component.formula = 'a*x*x+b_10*y*y-r_t';
    component.onRedraw();
    expect(component.error).toBe('');
    expect(component.parameters.map(parameter => parameter.name)).toEqual(['a', 'b_10', 'r_t']);
    const a = component.parameters[0];
    a.value = 2;
    a.min = 0; a.max = 10; a.step = 0.25;
    component.curveGraph.zoom(0.5);
    component.updateParameter(a);
    expect(component.curveGraph.functions[0].fn(2, 0)).toBe(7);
    expect(component.curveGraph.xMax).toBe(1.5);
    component.curveGraph.resetView();
    expect(component.xMax).toBe(3);
    component.formula = 'b_10*x';
    component.syncParameters();
    expect(component.parameters.map(parameter => parameter.name)).toEqual(['b_10']);
    component.formula = 'a*x';
    component.syncParameters();
    expect(component.parameters[0]).toBe(a);
    expect([a.value, a.min, a.max, a.step]).toEqual([2, 0, 10, 0.25]);
  });

  it('validates parameter ranges and clamps values when the interval shrinks', () => {
    component.formula = 'x*x+y*y-a';
    component.onRedraw();
    const a = component.parameters[0];
    const draw = spyOn(component.curveGraph, 'drawGraph');
    a.step = 0;
    component.updateParameter(a);
    expect(a.error).toContain('paso');
    expect(component.parameterRangeValid(a)).toBeFalse();
    expect(draw).not.toHaveBeenCalled();
    a.step = 0.1; a.min = 5; a.max = 5;
    component.updateParameter(a, true);
    expect(a.error).toContain('mínimo');
    a.min = -1; a.max = 0.5;
    component.updateParameter(a, true);
    expect(a.value).toBe(0.5);
    expect(a.error).toBe('');
    expect(draw).toHaveBeenCalled();
    draw.calls.reset();
    a.value = NaN;
    component.updateParameter(a);
    expect(a.error).toContain('finito');
    expect(draw).not.toHaveBeenCalled();
  });

  it('synchronizes numeric inputs and sliders below the graph', fakeAsync(() => {
    component.formula = 'a*x+y';
    component.onRedraw();
    fixture.detectChanges(); tick(20); fixture.detectChanges();
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('.parameter-slider');
    const value: HTMLInputElement = fixture.nativeElement.querySelector('#parameter-value-a');
    slider.value = '2.5'; slider.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges(); tick(20); fixture.detectChanges();
    expect(component.parameters[0].value).toBe(2.5);
    expect(Number(value.value)).toBe(2.5);
    expect(component.curveGraph.functions[0].fn(2, 0)).toBe(5);
    value.value = '-2'; value.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges(); tick(20); fixture.detectChanges();
    expect(Number(slider.value)).toBe(-2);
    expect(component.curveGraph.functions[0].fn(2, 0)).toBe(-4);
  }));

  it('keeps bound inputs in sync with zoom, wheel, dragging, pinch and reset', fakeAsync(() => {
    const graph = component.curveGraph;
    const canvas = graph.canvas.nativeElement;
    spyOn(canvas, 'getBoundingClientRect').and.returnValue({ left: 0, top: 0, width: 400, height: 400 } as DOMRect);
    spyOn(canvas, 'setPointerCapture');
    const check = (): void => {
      fixture.detectChanges();
      tick(20);
      fixture.detectChanges();
      const actualBounds = [graph.xMin, graph.xMax, graph.yMin, graph.yMax];
      expect([component.xMin, component.xMax, component.yMin, component.yMax]).toEqual(actualBounds);
      for (const [index, name] of ['xMin', 'xMax', 'yMin', 'yMax'].entries()) {
        expect(Number(fixture.nativeElement.querySelector(`input[name="${name}"]`).value)).toBe(actualBounds[index]);
      }
    };
    graph.zoom(0.5);
    check();
    expect(component.xMax).toBe(1.5);
    graph.wheelZoomEnabled = true;
    graph.wheelZoom(new WheelEvent('wheel', { clientX: 100, clientY: 100, deltaY: -50, cancelable: true }));
    check();
    graph.dragEnabled = true;
    const pointer = (id: number, x: number, y: number, pointerType = 'mouse'): PointerEvent =>
      new PointerEvent('pointermove', { pointerId: id, clientX: x, clientY: y, pointerType, button: 0 });
    const previousMin = component.xMin;
    graph.pointerDown(pointer(1, 200, 200));
    graph.pointerMove(pointer(1, 250, 220));
    graph.pointerUp(pointer(1, 250, 220));
    check();
    expect(component.xMin).toBeLessThan(previousMin);
    graph.pointerDown(pointer(2, 100, 200, 'touch'));
    graph.pointerDown(pointer(3, 300, 200, 'touch'));
    const previousWidth = component.xMax - component.xMin;
    graph.pointerMove(pointer(3, 350, 200, 'touch'));
    check();
    expect(component.xMax - component.xMin).toBeLessThan(previousWidth);
    graph.pointerUp();
    graph.resetView();
    check();
    expect([component.xMin, component.xMax, component.yMin, component.yMax]).toEqual([-3, 3, -3, 3]);
  }));

  it('retains the explored view on redraw and accepts new manual limits', () => {
    const graph = component.curveGraph;
    graph.zoom(0.5);
    component.onRedraw();
    expect([graph.xMin, graph.xMax, graph.yMin, graph.yMax]).toEqual([-1.5, 1.5, -1.5, 1.5]);
    [component.xMin, component.xMax, component.yMin, component.yMax] = [-4, 2, -1, 5];
    component.onRedraw();
    graph.zoom(0.5);
    graph.resetView();
    expect([component.xMin, component.xMax, component.yMin, component.yMax]).toEqual([-4, 2, -1, 5]);
  });

  it('paginates results, resets filters and searches families without accents', () => {
    component.exampleCategory = 'Todos';
    expect(component.pagedExamples.length).toBe(component.examplePageSize);
    const firstId = component.pagedExamples[0].id;
    component.changeExamplePage(1);
    expect(component.currentExamplePage).toBe(1);
    expect(component.pagedExamples[0].id).not.toBe(firstId);
    component.exampleSearch = 'gielis petalo';
    component.resetExamplePage();
    expect(component.visibleExamples.length).toBe(13);
    expect(component.currentExamplePage).toBe(0);
    component.exampleKind = 'Composición';
    expect(component.visibleExamples.length).toBe(0);
    component.exampleSearch = '';
    component.exampleKind = 'Clásica';
    expect(component.visibleExamples.some(example => example.id === 'bicorn')).toBeTrue();
    component.changeExamplePage(1000);
    expect(component.currentExamplePage).toBe(component.examplePageCount - 1);
    component.exampleSearch = 'sin-resultados-abc';
    expect(component.pagedExamples).toEqual([]);
    expect(component.currentExamplePage).toBe(0);
  });
});
