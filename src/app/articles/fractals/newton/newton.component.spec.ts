import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtonComponent } from './newton.component';

describe('NewtonComponent', () => {
  let component: NewtonComponent;
  let fixture: ComponentFixture<NewtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
