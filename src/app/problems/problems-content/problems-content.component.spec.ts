import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ProblemsContentComponent } from './problems-content.component';

const fakeActivatedRoute = {
  snapshot: { data: {} }
} as ActivatedRoute;

describe('ProblemsContentComponent', () => {
  let component: ProblemsContentComponent;
  let fixture: ComponentFixture<ProblemsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsContentComponent],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
