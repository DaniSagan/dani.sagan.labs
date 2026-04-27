import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeptagonArticleComponent } from './heptagon-article.component';

describe('HeptagonArticleComponent', () => {
  let component: HeptagonArticleComponent;
  let fixture: ComponentFixture<HeptagonArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeptagonArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeptagonArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
