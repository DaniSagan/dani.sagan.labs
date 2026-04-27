import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexagonArticleComponent } from './hexagon-article.component';

describe('HexagonArticleComponent', () => {
  let component: HexagonArticleComponent;
  let fixture: ComponentFixture<HexagonArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexagonArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HexagonArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
