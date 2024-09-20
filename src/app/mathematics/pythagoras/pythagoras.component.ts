import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-pythagoras',
  templateUrl: './pythagoras.component.html',
  styleUrls: ['./pythagoras.component.css'],
  standalone: true,
})
export class PythagorasComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;

  public context!: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d')!;
  }

  ngOnInit(): void {}
}
