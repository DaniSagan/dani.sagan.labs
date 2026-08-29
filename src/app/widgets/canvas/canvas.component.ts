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
import { Vec2 } from 'src/app/shared/math/vec2';
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
  @Input() size: Vec2;

  private context!: CanvasRenderingContext2D;

  public scene: SceneItem;

  constructor() {
    this.size = new Vec2(100, 100);
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
