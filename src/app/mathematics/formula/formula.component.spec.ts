import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaComponent } from './formula.component';
import { MathjaxModule } from 'mathjax-angular';

describe('FormulaComponent', () => {
  let component: FormulaComponent;
  let fixture: ComponentFixture<FormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaComponent, MathjaxModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
