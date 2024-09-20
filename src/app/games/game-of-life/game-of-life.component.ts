import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor],
})
export class GameOfLifeComponent implements OnInit {
  rows: number = 20;
  cols: number = 20;
  board: boolean[][] = [];
  interval: any;
  running = false;
  speed = 500; // Velocidad en milisegundos entre generaciones

  ngOnInit(): void {
    this.createBoard();
  }

  // Crear el tablero inicial vacío
  createBoard(): void {
    this.board = [];
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = false;
      }
    }
  }

  // Cambiar el estado de una celda (viva o muerta) al hacer clic
  toggleCell(row: number, col: number): void {
    this.board[row][col] = !this.board[row][col];
  }

  // Avanzar una generación en el juego
  nextGeneration(): void {
    const newBoard: boolean[][] = this.createEmptyBoard();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const aliveNeighbors = this.countAliveNeighbors(row, col);
        const isAlive = this.board[row][col];

        // Aplicar las reglas del juego
        if (isAlive && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
          newBoard[row][col] = true;
        } else if (!isAlive && aliveNeighbors === 3) {
          newBoard[row][col] = true;
        } else {
          newBoard[row][col] = false;
        }
      }
    }
    this.board = newBoard;
  }

  // Crear un tablero vacío
  createEmptyBoard(): boolean[][] {
    const newBoard: boolean[][] = [];
    for (let i = 0; i < this.rows; i++) {
      newBoard[i] = [];
      for (let j = 0; j < this.cols; j++) {
        newBoard[i][j] = false;
      }
    }
    return newBoard;
  }

  // Contar los vecinos vivos de una celda
  countAliveNeighbors(row: number, col: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;
        if (this.isValidCell(newRow, newCol) && this.board[newRow][newCol]) {
          count++;
        }
      }
    }
    return count;
  }

  // Verificar si una celda está dentro de los límites del tablero
  isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  // Iniciar el juego
  startGame(): void {
    if (!this.running) {
      this.running = true;
      this.interval = setInterval(() => this.nextGeneration(), this.speed);
    }
  }

  // Pausar el juego
  pauseGame(): void {
    if (this.running) {
      this.running = false;
      clearInterval(this.interval);
    }
  }

  // Reiniciar el tablero
  resetBoard(): void {
    this.pauseGame();
    this.createBoard();
  }

  // Cambiar el tamaño del tablero
  resizeBoard(): void {
    this.pauseGame();
    this.createBoard();
  }

  // Cambiar la velocidad de la simulación
  changeSpeed(newSpeed: number): void {
    this.speed = newSpeed;
    if (this.running) {
      this.pauseGame();
      this.startGame();
    }
  }
}
