import { TestBed } from '@angular/core/testing';
import { FibonacciExplorerComponent } from './fibonacci-explorer.component';
import { FibonacciSquaresComponent } from './fibonacci-squares.component';

describe('Fibonacci widgets', () => {
  it('handles initial terms, exact results and invalid input', async () => {
    await TestBed.configureTestingModule({ imports: [FibonacciExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FibonacciExplorerComponent);
    const component = fixture.componentInstance;
    component.example(0); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('0');
    expect(component.points.length).toBe(0);
    component.example(100); fixture.detectChanges();
    expect(component.result).toBe('354224848179261915075');
    expect(component.points.length).toBe(29);
    expect(component.points[28].ratio).toBeCloseTo(component.phi, 10);
    component.input = null; component.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    expect(component.error).not.toBe('');
    fixture.destroy();
  });
  it('updates the square mosaic and its area', async () => {
    await TestBed.configureTestingModule({ imports: [FibonacciSquaresComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FibonacciSquaresComponent);
    fixture.componentInstance.count = 5; fixture.componentInstance.update(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('rect').length).toBe(5);
    expect(fixture.componentInstance.area).toBe(40);
    fixture.destroy();
  });
});
