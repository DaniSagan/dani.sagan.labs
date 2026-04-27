import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PentagonArticleComponent } from './pentagon-article.component';

describe('PentagonArticleComponent', () => {
  let component: PentagonArticleComponent;
  let fixture: ComponentFixture<PentagonArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PentagonArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PentagonArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
