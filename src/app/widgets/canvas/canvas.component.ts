import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Vector2 } from 'src/app/mathematics/geometry/vector2';
import { CanvasItem } from './items/canvas-item';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() size: Vector2;

  private context!: CanvasRenderingContext2D;

  constructor() {
    this.size = new Vector2(100, 100);
  }

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d')!;
  }

  ngOnInit(): void {
  }

  refresh() {
    this.context.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
  }

  draw(item: CanvasItem) {
    item.draw(this.context);
  }
}
