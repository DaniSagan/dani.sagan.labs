import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesNavbarComponent } from './articles-navbar.component';

describe('ArticlesNavbarComponent', () => {
  let component: ArticlesNavbarComponent;
  let fixture: ComponentFixture<ArticlesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesNavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
