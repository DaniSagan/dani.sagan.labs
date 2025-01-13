import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-zoom',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.css'
})
export class ZoomComponent {
  @Output() zoom = new EventEmitter<number>();
  @Output() reset = new EventEmitter();

  zoomIn() {
    this.zoom.emit(1);
  }

  zoomOut() {
    this.zoom.emit(-1);
  }

  zoomReset() {
    this.reset.emit();
  }
}
