import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-four-in-a-row',
  templateUrl: './four-in-a-row.component.html',
  styleUrls: ['./four-in-a-row.component.css']
})
export class FourInARowComponent implements OnInit {
  rows = 6;
  cols = 7;
  board: string[][] = [];
  currentPlayer: 'R' | 'Y' = 'R'; // 'R' es el jugador humano, 'Y' es el ordenador.
  gameOver = false;
  message = '';

  ngOnInit(): void {
    this.initializeBoard();
  }

  // Inicializar el tablero con celdas vacías
  initializeBoard() {
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

  // Colocar una ficha en una columna
  placePiece(col: number): void {
    if (this.gameOver || this.board[0][col] !== '') {
      return; // No se puede colocar en una columna llena o si el juego ha terminado
    }

    // Encontrar la primera fila vacía en la columna
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row][col] === '') {
        this.board[row][col] = this.currentPlayer;
        break;
      }
    }

    if (this.checkWin(this.currentPlayer)) {
      this.message = this.currentPlayer === 'R' ? '¡Ganaste!' : 'El ordenador ganó';
      this.gameOver = true;
      return;
    }

    // Cambiar de turno
    this.currentPlayer = this.currentPlayer === 'R' ? 'Y' : 'R';

    if (this.currentPlayer === 'Y') {
      this.message = 'Turno del ordenador...';
      setTimeout(() => this.computerMove(), 500); // IA juega después de un pequeño retraso
    } else {
      this.message = 'Tu turno';
    }
  }

  // Movimiento inteligente de la computadora con algoritmo Minimax
  computerMove(): void {
    if (this.gameOver) return;

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

    this.placePiece(bestCol);
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
        const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
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
          board[row + 3][col + 3]
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
          board[row + 3][col - 3]
        ];
        score += this.evaluateWindow(window, player);
      }
    }

    return score;
  }

  evaluateWindow(window: string[], player: string): number {
    let score = 0;
    const opponent = player === 'Y' ? 'R' : 'Y';

    const playerCount = window.filter(cell => cell === player).length;
    const emptyCount = window.filter(cell => cell === '').length;
    const opponentCount = window.filter(cell => cell === opponent).length;

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
