import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';

@Component({
  selector: 'app-heron-formula-article',
  standalone: true,
  imports: [FormulaComponent],
  templateUrl: './heron-formula-article.component.html',
  styleUrl: './heron-formula-article.component.css'
})
export class HeronFormulaArticleComponent implements AfterViewInit {
  static title = 'Fórmula de Herón';
  static route = 'heron-formula';

  @ViewChild('triangleCanvas', { static: true }) triangleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exampleCanvas', { static: true }) exampleCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.drawTriangle(this.triangleCanvas.nativeElement, false);
    this.drawTriangle(this.exampleCanvas.nativeElement, true);
  }

  private drawTriangle(canvas: HTMLCanvasElement, example: boolean): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw in a 600 × 340 coordinate system with a double-resolution bitmap.
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 600, 340);
    const left = example ? 150 : 70;
    const right = example ? 450 : 530;
    const foot = example ? 300 : 245;
    const top = 50;
    const bottom = 250;

    const line = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    const label = (text: string, x: number, y: number, color = '#e8e4d8') => {
      ctx.fillStyle = color;
      ctx.font = '18px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y);
    };

    // Distinct fills show the two right triangles used in Pythagoras.
    for (const [edge, fill] of [[left, 'rgba(232,199,119,0.14)'], [right, 'rgba(155,212,255,0.14)']] as const) {
      ctx.beginPath();
      ctx.moveTo(edge, bottom);
      ctx.lineTo(foot, top);
      ctx.lineTo(foot, bottom);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    line(left, bottom, foot, top, '#e8c777');
    line(foot, top, right, bottom, '#e8c777');
    line(left, bottom, right, bottom, '#e8c777');
    ctx.setLineDash([6, 5]);
    line(foot, top, foot, bottom, '#9bd4ff');
    ctx.setLineDash([]);
    line(foot, bottom - 14, foot + 14, bottom - 14, '#9bd4ff');
    line(foot + 14, bottom - 14, foot + 14, bottom, '#9bd4ff');

    label('A', left - 18, bottom + 5);
    label('B', right + 18, bottom + 5);
    label('C', foot, top - 18);
    label('H', foot, bottom + 25);
    label(example ? 'b = 5' : 'b', (left + foot) / 2 - 24, 145, '#e8c777');
    label(example ? 'a = 5' : 'a', (right + foot) / 2 + 24, 145, '#e8c777');
    label(example ? 'h = 4' : 'h', foot + 35, 165, '#9bd4ff');
    label(example ? '3' : 'x', (left + foot) / 2, bottom + 25);
    label(example ? '3' : 'c − x', (right + foot) / 2, bottom + 25);
    line(left, 300, right, 300, '#e8c777');
    line(left, 295, left, 305, '#e8c777');
    line(right, 295, right, 305, '#e8c777');
    label(example ? 'c = 6' : 'c', (left + right) / 2, 325, '#e8c777');
  }
}
