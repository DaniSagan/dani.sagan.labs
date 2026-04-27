import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareArticleComponent } from './square-article.component';

describe('SquareArticleComponent', () => {
  let component: SquareArticleComponent;
  let fixture: ComponentFixture<SquareArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SquareArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
