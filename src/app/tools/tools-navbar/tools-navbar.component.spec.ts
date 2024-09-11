import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsNavbarComponent } from './tools-navbar.component';

describe('ToolsNavbarComponent', () => {
  let component: ToolsNavbarComponent;
  let fixture: ComponentFixture<ToolsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
