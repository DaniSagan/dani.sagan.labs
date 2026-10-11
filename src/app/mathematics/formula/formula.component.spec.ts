import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaObsoleteComponent } from './formula.component';
import { MathjaxModule } from 'mathjax-angular';

describe('FormulaComponent', () => {
  let component: FormulaObsoleteComponent;
  let fixture: ComponentFixture<FormulaObsoleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaObsoleteComponent, MathjaxModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaObsoleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
