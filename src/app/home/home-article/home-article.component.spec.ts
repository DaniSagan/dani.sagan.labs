import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeArticleComponent } from './home-article.component';

describe('HomeArticleComponent', () => {
  let component: HomeArticleComponent;
  let fixture: ComponentFixture<HomeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeArticleComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
