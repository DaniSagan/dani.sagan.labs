import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FractalExplorerComponent } from './fractal-explorer.component';

describe('FractalExplorerComponent', () => {
  let fixture: ComponentFixture<FractalExplorerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FractalExplorerComponent] }).compileComponents();
    fixture = TestBed.createComponent(FractalExplorerComponent);
    fixture.componentRef.setInput('title', 'Test construction');
    fixture.componentRef.setInput('draw', (ctx: CanvasRenderingContext2D) => ctx.fillRect(10, 10, 20, 20));
    fixture.componentRef.setInput('initialIterations', 5);
    fixture.componentRef.setInput('minIterations', 2);
    fixture.componentRef.setInput('maxIterations', 6);
  });
  afterEach(() => fixture.destroy());
  it('initializes consumer inputs without changing an already checked binding', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.iterations).toBe(5);
    expect(fixture.nativeElement.querySelector('input').value).toBe('5');
  });
  it('disables stepping past construction bounds and resets to the consumer default', () => {
    fixture.detectChanges();
    fixture.componentInstance.step(100);
    fixture.detectChanges();
    expect(fixture.componentInstance.iterations).toBe(6);
    expect(fixture.nativeElement.querySelector('.step-controls button:last-child').disabled).toBeTrue();
    fixture.componentInstance.step(-100);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.step-controls button:first-child').disabled).toBeTrue();
    fixture.nativeElement.querySelector('.step-controls button:nth-child(2)').click();
    expect(fixture.componentInstance.iterations).toBe(5);
  });
});
