import { Component, OnDestroy } from '@angular/core';

type Mark = '' | 'X' | 'O';
@Component({
  selector: 'app-tic-tac-toe', standalone: true,
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnDestroy {
  board: Mark[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  readonly rows = [0, 1, 2];
  readonly columns = [0, 1, 2];
  readonly lines = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
  ];
  thinking = false;
  winner: Mark = '';
  winningCells: number[][] = [];
  private timer?: ReturnType<typeof setTimeout>;
  get moves(): number { return this.board.flat().filter(Boolean).length; }
  get gameOver(): boolean { return !!this.winner || this.moves === 9; }
  get status(): string { return this.winner === 'X' ? '¡Tres en raya! Has ganado.' : this.winner === 'O' ? 'La máquina completa la línea.' : this.gameOver ? 'Empate. El tablero está completo.' : this.thinking ? 'La máquina está pensando…' : 'Tu turno. Elige una casilla.'; }
  get statusTitle(): string { return this.winner === 'X' ? 'Línea conseguida' : this.winner === 'O' ? 'Gana la máquina' : this.gameOver ? 'Tablas' : this.thinking ? 'Turno de la máquina' : 'Tu siguiente movimiento'; }
  isWinning(row: number, col: number): boolean { return this.winningCells.some(cell => cell[0] === row && cell[1] === col); }
  play(row: number, col: number): void {
    if (this.gameOver || this.thinking || this.board[row]?.[col] !== '') return;
    this.board[row][col] = 'X';
    this.finishTurn('X');
    if (!this.gameOver) {
      this.thinking = true;
      this.timer = setTimeout(() => {
        this.timer = undefined;
        const move = this.minimax(this.board, 'O').move;
        if (move) this.board[move.row][move.col] = 'O';
        this.thinking = false;
        this.finishTurn('O');
      }, 400);
    }
  }
  private finishTurn(player: Mark): void {
    const line = this.lines.find(cells => cells.every(([r,c]) => this.board[r][c] === player));
    if (line) { this.winner = player; this.winningCells = line; }
  }
  minimax(board: Mark[][], player: 'X' | 'O'): { score: number; move: { row: number; col: number } | null } {
    const wins = (mark: Mark) => this.lines.some(line => line.every(([r,c]) => board[r][c] === mark));
    if (wins('X')) return { score: -10, move: null };
    if (wins('O')) return { score: 10, move: null };
    if (board.flat().every(Boolean)) return { score: 0, move: null };
    let best = { score: player === 'O' ? -Infinity : Infinity, move: null as { row: number; col: number } | null };
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      if (board[row][col]) continue;
      board[row][col] = player;
      const score = this.minimax(board, player === 'O' ? 'X' : 'O').score;
      board[row][col] = '';
      if (player === 'O' ? score > best.score : score < best.score) best = { score, move: { row, col } };
    }
    return best;
  }
  resetGame(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.board = [['', '', ''], ['', '', ''], ['', '', '']];
    this.winner = ''; this.winningCells = []; this.thinking = false;
  }
  ngOnDestroy(): void { clearTimeout(this.timer); }
}