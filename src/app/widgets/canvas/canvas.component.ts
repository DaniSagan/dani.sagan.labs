import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Vector2 } from 'src/app/mathematics/geometry/vector2';
import { CanvasItem } from './items/canvas-item';
import { SceneItem } from './items/scene-item';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  standalone: true,
})
export class CanvasComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() size: Vector2;

  private context!: CanvasRenderingContext2D;

  public scene: SceneItem;

  constructor() {
    this.size = new Vector2(100, 100);
    this.scene = new SceneItem();
  }

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d')!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.draw();
  }

  ngOnInit(): void {}

  refresh() {
    this.context.clearRect(
      0,
      0,
      this.myCanvas.nativeElement.width,
      this.myCanvas.nativeElement.height
    );
  }

  // draw(item: CanvasItem) {
  //   item.draw(this.context);
  // }

  draw() {
    this.scene.draw(this.context);
  }
}
