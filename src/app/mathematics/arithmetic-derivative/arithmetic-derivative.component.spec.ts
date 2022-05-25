import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArithmeticDerivativeComponent } from './arithmetic-derivative.component';

describe('ArithmeticDerivativeComponent', () => {
  let component: ArithmeticDerivativeComponent;
  let fixture: ComponentFixture<ArithmeticDerivativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArithmeticDerivativeComponent ]
    })
    .compileComponents();
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
