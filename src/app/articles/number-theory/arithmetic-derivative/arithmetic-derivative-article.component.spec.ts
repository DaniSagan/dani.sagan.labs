import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArithmeticDerivativeArticleComponent } from './arithmetic-derivative-article.component';
import { MathjaxModule } from 'mathjax-angular';

describe('ArithmeticDerivativeArticleComponent', () => {
  let component: ArithmeticDerivativeArticleComponent;
  let fixture: ComponentFixture<ArithmeticDerivativeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArithmeticDerivativeArticleComponent, MathjaxModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArithmeticDerivativeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
