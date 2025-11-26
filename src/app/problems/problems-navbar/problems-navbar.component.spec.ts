import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsNavbarComponent } from './problems-navbar.component';

describe('ProblemsNavbarComponent', () => {
  let component: ProblemsNavbarComponent;
  let fixture: ComponentFixture<ProblemsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsNavbarComponent]
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
