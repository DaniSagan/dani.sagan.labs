import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Vec2 } from 'src/app/shared/math/vec2';

@Component({
  selector: 'app-move2d',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './move2d.component.html',
  styleUrl: './move2d.component.css'
})
export class Move2DComponent {
  @Output() movement = new EventEmitter<Vec2>();

  moveUp() {
    this.movement.emit({x: 0, y: 1});
  }

  moveDown() {
    this.movement.emit({x: 0, y: -1});
  }

  moveLeft() {
    this.movement.emit({x: -1, y: 0});
  }

  moveRight() {
    this.movement.emit({x: 1, y: 0});
  }
}
