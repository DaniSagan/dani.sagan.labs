import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDecompositionArticleComponent } from './prime-decomposition-article.component';

describe('PrimeDecompositionArticleComponent', () => {
  let component: PrimeDecompositionArticleComponent;
  let fixture: ComponentFixture<PrimeDecompositionArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeDecompositionArticleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeDecompositionArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
