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
