import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcosahedronViewerComponent } from './icosahedron-viewer.component';

describe('IcosahedronViewerComponent', () => {
  let component: IcosahedronViewerComponent;
  let fixture: ComponentFixture<IcosahedronViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcosahedronViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IcosahedronViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
