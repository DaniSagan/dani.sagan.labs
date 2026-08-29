import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ProblemsNavbarComponent } from './problems-navbar.component';

const fakeActivatedRoute = {
  snapshot: { data: {} }
} as ActivatedRoute;

describe('ProblemsNavbarComponent', () => {
  let component: ProblemsNavbarComponent;
  let fixture: ComponentFixture<ProblemsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsNavbarComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
