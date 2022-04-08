import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArticleComponent } from './test-article.component';

describe('TestArticleComponent', () => {
  let component: TestArticleComponent;
  let fixture: ComponentFixture<TestArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
