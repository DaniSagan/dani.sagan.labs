import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArithmeticDerivativeComponent } from './arithmetic-derivative.component';
import { MathjaxModule } from 'mathjax-angular';

describe('ArithmeticDerivativeComponent', () => {
  let component: ArithmeticDerivativeComponent;
  let fixture: ComponentFixture<ArithmeticDerivativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArithmeticDerivativeComponent, MathjaxModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArithmeticDerivativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
