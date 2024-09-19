import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexahedronViewerComponent } from './hexahedron-viewer.component';

describe('HexahedronViewerComponent', () => {
  let component: HexahedronViewerComponent;
  let fixture: ComponentFixture<HexahedronViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HexahedronViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexahedronViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
