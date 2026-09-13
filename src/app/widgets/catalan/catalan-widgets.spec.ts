import { TestBed } from '@angular/core/testing';
import { CatalanCalculatorComponent } from './catalan-calculator.component';
import { DyckExplorerComponent } from './dyck-explorer.component';

describe('Catalan widgets', () => {
  it('renders exact results and clears stale results on invalid input', async () => {
    await TestBed.configureTestingModule({ imports: [CatalanCalculatorComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CatalanCalculatorComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('16796');
    fixture.componentInstance.example(0); expect(fixture.componentInstance.result).toBe('1');
    fixture.componentInstance.input = null; fixture.componentInstance.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    expect(fixture.componentInstance.error).not.toBe('');
    fixture.destroy();
  });
  it('navigates paths, follows prefixes and handles the empty configuration', async () => {
    await TestBed.configureTestingModule({ imports: [DyckExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DyckExplorerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges(); expect(component.words.length).toBe(5);
    component.step = 2; component.draw(); expect(component.height).toBe(2);
    component.move(1); expect(component.index).toBe(1); expect(component.step).toBe(6);
    component.n = 0; component.generate(); fixture.detectChanges();
    await fixture.whenStable(); fixture.detectChanges();
    expect(component.word).toBe(''); expect(component.points).toBe('45,270');
    expect(fixture.nativeElement.querySelector('input[type=range]').disabled).toBeTrue();
    fixture.destroy();
  });
});
