import { TestBed } from '@angular/core/testing';
import { AmicableExplorerComponent } from './amicable-explorer.component';
import { AmicableSearchComponent } from './amicable-search.component';

describe('amicable widgets', () => {
  it('renders journeys and clears invalid results', async () => {
    await TestBed.configureTestingModule({ imports: [AmicableExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AmicableExplorerComponent);
    fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('son amigos');
    fixture.componentInstance.example(1); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('no calculamos divisores de 0');
    fixture.componentInstance.input = null; fixture.componentInstance.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.journey')).toBeNull();
    fixture.destroy();
  });
  it('renders bounded search results and the empty state', async () => {
    await TestBed.configureTestingModule({ imports: [AmicableSearchComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AmicableSearchComponent);
    fixture.detectChanges(); expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    fixture.componentInstance.input = 250; fixture.componentInstance.search(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay parejas completas');
    fixture.destroy();
  });
});
