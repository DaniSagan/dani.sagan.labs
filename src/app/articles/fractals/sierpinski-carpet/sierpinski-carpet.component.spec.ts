import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SierpinskiCarpetComponent } from './sierpinski-carpet.component';

describe('SierpinskiCarpetComponent', () => {
  let component: SierpinskiCarpetComponent;
  let fixture: ComponentFixture<SierpinskiCarpetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SierpinskiCarpetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SierpinskiCarpetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
