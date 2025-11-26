import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsContentComponent } from './problems-content.component';

describe('ProblemsContentComponent', () => {
  let component: ProblemsContentComponent;
  let fixture: ComponentFixture<ProblemsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemsContentComponent]
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
