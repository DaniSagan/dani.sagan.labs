import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OctagonArticleComponent } from './octagon-article.component';

describe('OctagonArticleComponent', () => {
  let component: OctagonArticleComponent;
  let fixture: ComponentFixture<OctagonArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OctagonArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OctagonArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
