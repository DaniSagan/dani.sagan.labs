import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseArticleComponent } from './ellipse-article.component';

describe('EllipseArticleComponent', () => {
  let component: EllipseArticleComponent;
  let fixture: ComponentFixture<EllipseArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EllipseArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EllipseArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
