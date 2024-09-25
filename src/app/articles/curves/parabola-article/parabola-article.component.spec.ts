import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParabolaArticleComponent } from './parabola-article.component';

describe('ParabolaArticleComponent', () => {
  let component: ParabolaArticleComponent;
  let fixture: ComponentFixture<ParabolaArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParabolaArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParabolaArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
