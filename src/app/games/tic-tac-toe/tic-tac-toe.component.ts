import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  private currentPlayer: string = 'X';
  private gameOver: boolean = false;
  private cellSize: number = 200;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawBoard();
  }

  drawBoard(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Configurar el estilo de neón
    this.ctx.strokeStyle = '#00FFFF'; // Color cian brillante
    this.ctx.shadowColor = '#00FFFF';
    this.ctx.shadowBlur = 10;
    this.ctx.lineWidth = 5;

    // Dibujar la cuadrícula
    for (let i = 1; i <= 2; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, canvasHeight);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(canvasWidth, i * this.cellSize);
      this.ctx.stroke();
    }

    // Dibujar las jugadas
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const mark = this.board[row][col];
        if (mark) {
          this.drawMark(mark, row, col);
        }
      }
    }
  }

  drawMark(mark: string, row: number, col: number): void {
    const x = col * this.cellSize;
    const y = row * this.cellSize;
    this.ctx.font = '100px Arial';
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    if (mark === 'X') {
      this.ctx.fillText('X', x + this.cellSize / 2, y + this.cellSize / 2);
    } else if (mark === 'O') {
      this.ctx.fillText('O', x + this.cellSize / 2, y + this.cellSize / 2);
    }
  }

  async handleClick(event: MouseEvent): Promise<void> {
    if (this.gameOver) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    if (this.board[row][col] === '') {
      this.board[row][col] = this.currentPlayer;
      this.drawBoard();
      if (this.checkWin(this.currentPlayer)) {
        alert(this.currentPlayer + ' gana!');
        this.gameOver = true;
      } else if (this.checkTie()) {
        alert('Es un empate!');
        this.gameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.currentPlayer === 'O') {
          await this.aiMove();
        }
      }
    }
  }

  async aiMove(): Promise<void> {
    await this.sleep(500); // Añadir un pequeño retraso para simular el pensamiento de la IA
    const bestMove = this.minimax(this.board, 'O').move;
    if (bestMove) {
      this.board[bestMove.row][bestMove.col] = 'O';
      this.drawBoard();
      if (this.checkWin('O')) {
        alert('O gana!');
        this.gameOver = true;
      } else if (this.checkTie()) {
        alert('Es un empate!');
        this.gameOver = true;
      } else {
        this.currentPlayer = 'X';
      }
    }
  }

  minimax(board: string[][], player: string): { score: number, move: { row: number, col: number } | null } {
    if (this.checkWin('X')) return { score: -10, move: null };
    if (this.checkWin('O')) return { score: 10, move: null };
    if (this.checkTie()) return { score: 0, move: null };

    let best: { score: number, move: { row: number, col: number } | null } = {
      score: player === 'O' ? -Infinity : Infinity,
      move: null
    };

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === '') {
          board[row][col] = player;
          const score = this.minimax(board, player === 'O' ? 'X' : 'O').score;
          board[row][col] = '';

          if ((player === 'O' && score > best.score) || (player === 'X' && score < best.score)) {
            best = { score, move: { row, col } };
          }
        }
      }
    }

    return best;
  }

  checkWin(player: string): boolean {
    const winningCombinations = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]]
    ];

    return winningCombinations.some(combination =>
      combination.every(([row, col]) => this.board[row][col] === player)
    );
  }

  checkTie(): boolean {
    return this.board.flat().every(cell => cell !== '');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetGame(): void {
    this.board = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.drawBoard();
  }
}
