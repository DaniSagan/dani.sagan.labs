import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperbolaArticleComponent } from './hyperbola-article.component';

describe('HyperbolaArticleComponent', () => {
  let component: HyperbolaArticleComponent;
  let fixture: ComponentFixture<HyperbolaArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperbolaArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HyperbolaArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
