import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgnesiWitchArticleComponent } from './agnesi-witch-article.component';

describe('AgnesiWitchArticleComponent', () => {
  let component: AgnesiWitchArticleComponent;
  let fixture: ComponentFixture<AgnesiWitchArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgnesiWitchArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgnesiWitchArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
