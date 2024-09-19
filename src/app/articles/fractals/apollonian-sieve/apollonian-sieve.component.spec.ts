import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApollonianSieveComponent } from './apollonian-sieve.component';
import { FormsModule } from '@angular/forms';

describe('ApollonianSieveComponent', () => {
  let component: ApollonianSieveComponent;
  let fixture: ComponentFixture<ApollonianSieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ApollonianSieveComponent]
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
