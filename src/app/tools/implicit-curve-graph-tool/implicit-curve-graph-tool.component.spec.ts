import { ComponentFixture, TestBed } from '@angular/core/testing';
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
