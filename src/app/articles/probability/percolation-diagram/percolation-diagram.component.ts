import { Component, ElementRef, ViewChild, effect, signal } from '@angular/core';

@Component({
  selector: 'app-percolation-diagram',
  standalone: true,
  templateUrl: './percolation-diagram.component.html',
  styleUrl: './percolation-diagram.component.css'
})
export class PercolationDiagramComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  gridSize = 100;
  probability = signal(0.5);
  links: number[][][] = [];
  colors: string[] = [];

  static title: string = 'Diagrama de percolación';
  static route: string = 'percolation-diagram';

  isDrawing: boolean = false;

  ngOnInit() {
    this.initializeLinks();
  }

  ngAfterViewInit() {
    // effect(() => this.draw());
    this.draw()
  }

  updateProbability(event: Event) {
    const input = event.target as HTMLInputElement;
    this.probability.set(parseFloat(input.value));
    this.draw();
    console.log('Updated');
  }

  initializeLinks() {
    // Genera una matriz con valores aleatorios para los enlaces horizontales y verticales
    this.links = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => [Math.random(), Math.random()])
    );
    this.colors = this.generateColors(this.gridSize * this.gridSize);
  }

  generateColors(n: number): string[] {
    // Genera una lista de colores distintos
    const colors = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 137.5) % 360; // Espaciado uniforme en el espectro de colores
      colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
  }

  findRoot(parent: number[], x: number): number {
    if (parent[x] === x) return x;
    return (parent[x] = this.findRoot(parent, parent[x])); // Compresión de caminos
  }

  union(parent: number[], rank: number[], x: number, y: number) {
    let rootX = this.findRoot(parent, x);
    let rootY = this.findRoot(parent, y);
    if (rootX !== rootY) {
      if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
    }
  }

  async draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / this.gridSize;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Inicializar estructuras de unión para encontrar componentes conectados
    const parent = Array.from({ length: this.gridSize * this.gridSize }, (_, i) => i);
    const rank = Array(this.gridSize * this.gridSize).fill(0);

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const index = i * this.gridSize + j;
        const x = i * cellSize;
        const y = j * cellSize;

        // Conexión horizontal
        if (i < this.gridSize - 1 && this.links[i][j][0] < this.probability()) {
          const neighborIndex = (i + 1) * this.gridSize + j;
          this.union(parent, rank, index, neighborIndex);
        }

        // Conexión vertical
        if (j < this.gridSize - 1 && this.links[i][j][1] < this.probability()) {
          const neighborIndex = i * this.gridSize + (j + 1);
          this.union(parent, rank, index, neighborIndex);
        }
      }
      await this.sleep(0);
    }

    // Asignar colores a cada componente
    const componentColors: { [key: number]: string } = {};
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const root = this.findRoot(parent, i);
      if (!(root in componentColors)) {
        componentColors[root] = this.colors[Object.keys(componentColors).length % this.colors.length];
      }
      if(i % this.gridSize === 0) {
        await this.sleep(0);
      }
    }

    ctx.lineWidth = 2;
    this.isDrawing = true;
    for (let i = 0; i < this.gridSize; i++) {
      if (!this.isDrawing) break;
      for (let j = 0; j < this.gridSize; j++) {
        const index = i * this.gridSize + j;
        const x = i * cellSize;
        const y = j * cellSize;
        const color = componentColors[this.findRoot(parent, index)];

        // Dibuja nodos
        ctx.fillStyle = color;
        ctx.beginPath();
        //ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
        ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();

        // // Conexiones horizontales
        // if (i < this.gridSize - 1 && this.links[i][j][0] < this.probability()) {
        //   ctx.strokeStyle = color;
        //   ctx.beginPath();
        //   ctx.moveTo(x + cellSize / 2, y + cellSize / 2);
        //   ctx.lineTo(x + 3 * cellSize / 2, y + cellSize / 2);
        //   ctx.stroke();
        // }

        // // Conexiones verticales
        // if (j < this.gridSize - 1 && this.links[i][j][1] < this.probability()) {
        //   ctx.strokeStyle = color;
        //   ctx.beginPath();
        //   ctx.moveTo(x + cellSize / 2, y + cellSize / 2);
        //   ctx.lineTo(x + cellSize / 2, y + 3 * cellSize / 2);
        //   ctx.stroke();
        // }
      }
      await this.sleep(0);
    }
    this.isDrawing = false;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

