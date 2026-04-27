import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonagonArticleComponent } from './nonagon-article.component';

describe('NonagonArticleComponent', () => {
  let component: NonagonArticleComponent;
  let fixture: ComponentFixture<NonagonArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonagonArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonagonArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
