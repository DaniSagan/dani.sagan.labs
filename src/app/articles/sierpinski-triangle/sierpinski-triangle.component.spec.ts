import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SierpinskiTriangleComponent } from './sierpinski-triangle.component';

describe('SierpinskiTriangleComponent', () => {
  let component: SierpinskiTriangleComponent;
  let fixture: ComponentFixture<SierpinskiTriangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SierpinskiTriangleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SierpinskiTriangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
