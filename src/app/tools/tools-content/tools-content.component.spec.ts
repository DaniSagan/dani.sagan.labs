import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsContentComponent } from './tools-content.component';

describe('ToolsContentComponent', () => {
  let component: ToolsContentComponent;
  let fixture: ComponentFixture<ToolsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
