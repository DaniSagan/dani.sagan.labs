import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-four-in-a-row',
  templateUrl: './four-in-a-row.component.html',
  styleUrls: ['../board-game-layout.css', './four-in-a-row.component.css'],
  standalone: true,
})
export class FourInARowComponent implements OnInit, OnDestroy {
  rows = 6;
  cols = 7;
  board: string[][] = [];
  currentPlayer: 'R' | 'Y' = 'R'; // 'R' es el jugador humano, 'Y' es el ordenador.
  gameOver = false;
  message = '';
  readonly columnNumbers = [0, 1, 2, 3, 4, 5, 6];
  readonly rowNumbers = [0, 1, 2, 3, 4, 5];
  winningCells: number[][] = [];
  lastMove: { row: number; col: number } | null = null;
  hoveredColumn: number | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  get thinking(): boolean {
    return !this.gameOver && this.currentPlayer === 'Y';
  }
  get moves(): number {
    return this.board.flat().filter(Boolean).length;
  }
  get statusTitle(): string {
    return this.gameOver
      ? this.winningCells.length
        ? this.currentPlayer === 'R'
          ? 'Línea conseguida'
          : 'Gana la máquina'
        : 'Tablas'
      : this.thinking
        ? 'Turno de la máquina'
        : 'Elige tu columna';
  }
  isWinning(row: number, col: number): boolean {
    return this.winningCells.some((cell) => cell[0] === row && cell[1] === col);
  }
  columnLabel(col: number): string {
    return (
      'Columna ' +
      (col + 1) +
      ': ' +
      this.board
        .map(
          (row, index) =>
            'fila ' +
            (index + 1) +
            ' ' +
            (row[col] === 'R'
              ? 'tu ficha'
              : row[col] === 'Y'
                ? 'ficha de la máquina'
                : 'vacía'),
        )
        .join(', ') +
      (this.board[0]?.[col] ? '. Columna llena' : '. Colocar ficha')
    );
  }

  ngOnInit(): void {
    this.initializeBoard();
  }

  // Inicializar el tablero con celdas vacías
  initializeBoard() {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.winningCells = [];
    this.lastMove = null;
    this.hoveredColumn = null;
    this.board = [];
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.board[row][col] = '';
      }
    }
    this.gameOver = false;
    this.currentPlayer = 'R'; // El jugador humano empieza
    this.message = 'Tu turno';
  }

  placePiece(col: number): void {
    if (
      this.currentPlayer !== 'R' ||
      this.gameOver ||
      !Number.isInteger(col) ||
      col < 0 ||
      col >= this.cols ||
      this.board[0][col]
    )
      return;
    this.dropPiece(col);
  }
  private dropPiece(col: number): void {
    const row = this.getNextOpenRow(col);
    if (row < 0 || this.gameOver) return;
    this.board[row][col] = this.currentPlayer;
    this.lastMove = { row, col };
    this.hoveredColumn = null;
    this.winningCells = this.findWinningCells(this.currentPlayer);
    if (this.winningCells.length) {
      this.message =
        this.currentPlayer === 'R'
          ? '¡Cuatro en raya! Has ganado.'
          : 'La máquina completa la línea.';
      this.gameOver = true;
      return;
    }
    if (this.isBoardFull()) {
      this.message = 'Empate. El tablero está completo.';
      this.gameOver = true;
      return;
    }
    this.currentPlayer = this.currentPlayer === 'R' ? 'Y' : 'R';
    this.message = this.thinking
      ? 'La máquina está pensando…'
      : 'Tu turno. Elige una columna.';
    if (this.thinking)
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.computerMove();
      }, 400);
  }
  private findWinningCells(player: 'R' | 'Y'): number[][] {
    for (let row = 0; row < this.rows; row++)
      for (let col = 0; col < this.cols; col++)
        for (const [dr, dc] of [
          [0, 1],
          [1, 0],
          [1, 1],
          [1, -1],
        ]) {
          const cells = [0, 1, 2, 3].map((i) => [row + i * dr, col + i * dc]);
          if (cells.every(([r, c]) => this.board[r]?.[c] === player))
            return cells;
        }
    return [];
  }
  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  // Movimiento inteligente de la computadora con algoritmo Minimax
  computerMove(): void {
    if (this.gameOver || this.currentPlayer !== 'Y') return;

    let bestScore = -Infinity;
    let bestCol = 0;

    for (let col = 0; col < this.cols; col++) {
      if (this.board[0][col] === '') {
        // Simular colocar una ficha en la columna
        const row = this.getNextOpenRow(col);
        if (row !== -1) {
          this.board[row][col] = 'Y';
          const score = this.minimax(this.board, 5, false); // 5 niveles de profundidad
          this.board[row][col] = ''; // Deshacer el movimiento

          if (score > bestScore) {
            bestScore = score;
            bestCol = col;
          }
        }
      }
    }

    this.dropPiece(bestCol);
  }

  // Obtener la primera fila disponible en una columna
  getNextOpenRow(col: number): number {
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row][col] === '') {
        return row;
      }
    }
    return -1;
  }

  // Implementación del algoritmo Minimax
  minimax(board: string[][], depth: number, isMaximizing: boolean): number {
    if (this.checkWin('Y')) return 1000;
    if (this.checkWin('R')) return -1000;
    if (this.isBoardFull()) return 0;

    if (depth === 0) {
      return this.evaluateBoard(board);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let col = 0; col < this.cols; col++) {
        const row = this.getNextOpenRow(col);
        if (row !== -1) {
          board[row][col] = 'Y';
          const evaluation = this.minimax(board, depth - 1, false);
          board[row][col] = '';
          maxEval = Math.max(maxEval, evaluation);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let col = 0; col < this.cols; col++) {
        const row = this.getNextOpenRow(col);
        if (row !== -1) {
          board[row][col] = 'R';
          const evaluation = this.minimax(board, depth - 1, true);
          board[row][col] = '';
          minEval = Math.min(minEval, evaluation);
        }
      }
      return minEval;
    }
  }

  // Evaluar el tablero para la IA
  evaluateBoard(board: string[][]): number {
    let score = 0;

    // Revisar cada fila, columna y diagonal para obtener un puntaje
    score += this.evaluateLine(board, 'Y'); // Computadora
    score -= this.evaluateLine(board, 'R'); // Humano

    return score;
  }

  // Evaluar las líneas para generar puntajes
  evaluateLine(board: string[][], player: string): number {
    let score = 0;

    // Evaluar filas, columnas y diagonales
    score += this.checkRowsForScore(board, player);
    score += this.checkColsForScore(board, player);
    score += this.checkDiagonalsForScore(board, player);

    return score;
  }

  checkRowsForScore(board: string[][], player: string): number {
    let score = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 3; col++) {
        const window = board[row].slice(col, col + 4);
        score += this.evaluateWindow(window, player);
      }
    }
    return score;
  }

  checkColsForScore(board: string[][], player: string): number {
    let score = 0;
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows - 3; row++) {
        const window = [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col],
        ];
        score += this.evaluateWindow(window, player);
      }
    }
    return score;
  }

  checkDiagonalsForScore(board: string[][], player: string): number {
    let score = 0;

    // Diagonales hacia abajo a la derecha
    for (let row = 0; row < this.rows - 3; row++) {
      for (let col = 0; col < this.cols - 3; col++) {
        const window = [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ];
        score += this.evaluateWindow(window, player);
      }
    }

    // Diagonales hacia abajo a la izquierda
    for (let row = 0; row < this.rows - 3; row++) {
      for (let col = 3; col < this.cols; col++) {
        const window = [
          board[row][col],
          board[row + 1][col - 1],
          board[row + 2][col - 2],
          board[row + 3][col - 3],
        ];
        score += this.evaluateWindow(window, player);
      }
    }

    return score;
  }

  evaluateWindow(window: string[], player: string): number {
    let score = 0;
    const opponent = player === 'Y' ? 'R' : 'Y';

    const playerCount = window.filter((cell) => cell === player).length;
    const emptyCount = window.filter((cell) => cell === '').length;
    const opponentCount = window.filter((cell) => cell === opponent).length;

    if (playerCount === 4) {
      score += 100;
    } else if (playerCount === 3 && emptyCount === 1) {
      score += 5;
    } else if (playerCount === 2 && emptyCount === 2) {
      score += 2;
    }

    if (opponentCount === 3 && emptyCount === 1) {
      score -= 4;
    }

    return score;
  }

  // Comprobar si el tablero está lleno
  isBoardFull(): boolean {
    for (let col = 0; col < this.cols; col++) {
      if (this.board[0][col] === '') {
        return false;
      }
    }
    return true;
  }

  // Comprobar si el jugador actual ha ganado
  checkWin(player: 'R' | 'Y'): boolean {
    return (
      this.checkRows(player) ||
      this.checkCols(player) ||
      this.checkDiagonals(player)
    );
  }

  checkRows(player: 'R' | 'Y'): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 3; col++) {
        if (
          this.board[row][col] === player &&
          this.board[row][col + 1] === player &&
          this.board[row][col + 2] === player &&
          this.board[row][col + 3] === player
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkCols(player: 'R' | 'Y'): boolean {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows - 3; row++) {
        if (
          this.board[row][col] === player &&
          this.board[row + 1][col] === player &&
          this.board[row + 2][col] === player &&
          this.board[row + 3][col] === player
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkDiagonals(player: 'R' | 'Y'): boolean {
    // Diagonales hacia abajo a la derecha
    for (let row = 0; row < this.rows - 3; row++) {
      for (let col = 0; col < this.cols - 3; col++) {
        if (
          this.board[row][col] === player &&
          this.board[row + 1][col + 1] === player &&
          this.board[row + 2][col + 2] === player &&
          this.board[row + 3][col + 3] === player
        ) {
          return true;
        }
      }
    }
    // Diagonales hacia abajo a la izquierda
    for (let row = 0; row < this.rows - 3; row++) {
      for (let col = 3; col < this.cols; col++) {
        if (
          this.board[row][col] === player &&
          this.board[row + 1][col - 1] === player &&
          this.board[row + 2][col - 2] === player &&
          this.board[row + 3][col - 3] === player
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // Reiniciar el juego
  resetGame(): void {
    this.initializeBoard();
  }
}
