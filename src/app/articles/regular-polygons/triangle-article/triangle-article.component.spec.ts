import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriangleArticleComponent } from './triangle-article.component';

describe('TriangleArticleComponent', () => {
  let component: TriangleArticleComponent;
  let fixture: ComponentFixture<TriangleArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriangleArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriangleArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
