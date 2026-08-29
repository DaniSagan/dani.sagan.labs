import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { FormulaComponent } from './formula.component';

describe('FormulaComponent', () => {
  let component: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;

  beforeEach(async () => {
    (window as any).MathJax = {
      isReady: true,
      promise: Promise.resolve(),
      startup: {
        promise: Promise.resolve(),
        defaultReady: () => undefined,
        ready: () => undefined
      },
      typesetPromise: () => Promise.resolve()
    };

    await TestBed.configureTestingModule({
      imports: [FormulaComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
