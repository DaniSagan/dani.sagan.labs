import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApollonianSieveComponent } from './apollonian-sieve.component';

describe('ApollonianSieveComponent', () => {
  let component: ApollonianSieveComponent;
  let fixture: ComponentFixture<ApollonianSieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApollonianSieveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApollonianSieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
