import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Move2DComponent } from "../../../widgets/move2d/move2d.component";

@Component({
  selector: 'app-percolation-diagram',
  standalone: true,
  templateUrl: './percolation-diagram.component.html',
  styleUrl: './percolation-diagram.component.css',
  imports: [FormsModule, CommonModule, Move2DComponent]
})
export class PercolationDiagramComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  gridSize = 200;
  probability = 0.5;
  links: number[][] = [];
  clusters: number[][][] = [];

  static title: string = 'Diagrama de percolación';
  static route: string = 'percolation-diagram';

  isDrawing: boolean = false;

  ngOnInit() {
    this.initializeLinks();
    this.updateClusters();
  }

  initializeLinks() {
    this.links = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => Math.random())
    );
  }

  updateClusters() {
    const visited = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(false)
    );
    this.clusters = [];

    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (!visited[x][y] /*&& this.links[x][y] < this.probability*/) {
          const cluster = this.floodFill(x, y, visited);
          this.clusters.push(cluster);
        }
      }
    }
    this.draw();
  }

  floodFill(x: number, y: number, visited: boolean[][]): number[][] {
    const cluster = [];
    const stack = [[x, y]];

    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      if (visited[cx][cy]) continue;
      visited[cx][cy] = true;
      cluster.push([cx, cy]);

      const neighbors = [
        [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (
          nx >= 0 && nx < this.gridSize &&
          ny >= 0 && ny < this.gridSize &&
          !visited[nx][ny] && this.links[nx][ny] < this.probability
        ) {
          stack.push([nx, ny]);
        }
      }
    }
    return cluster;
  }

  async draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellSize = canvas.width / this.gridSize;

    this.isDrawing = true;
    this.clusters.forEach((cluster, index) => {
      const color = `hsl(${(index * 137) % 360}, 80%, 65%)`;
      //const color = `hsl(${(Math.round(Math.random() * 360)) % 360}, 80%, 65%)`;
      this.ctx.fillStyle = color;

      cluster.forEach(([x, y]) => {
        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      });
      this.sleep(0);
    });
    this.isDrawing = false;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

