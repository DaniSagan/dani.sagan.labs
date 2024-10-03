import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SudokuCell {
  value: number | null;
  possibleValues: number[];
  isFixed: boolean;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css'],
  standalone: true,
  imports: [ FormsModule, CommonModule ]
})
export class SudokuComponent implements OnInit {
  sudokuBoard: SudokuCell[][] = [];
  initialBoard: SudokuCell[][] = [];
  solutionChecked: boolean = false;
  solutionMessage: string = '';
  difficulty: string = 'Easy'; // Opciones: Easy, Medium, Hard

  ngOnInit(): void {
    this.generatePuzzle();
  }

  // Genera un puzzle de Sudoku basado en la dificultad seleccionada
  generatePuzzle(): void {
    // Genera un tablero completo
    let board = this.generateCompleteBoard();
    // Copia el tablero completo para referencia
    this.initialBoard = board.map(row => row.map(cell => ({
      value: cell.value,
      possibleValues: [],
      isFixed: cell.isFixed
    })));
    // Remueve números para crear el puzzle
    this.sudokuBoard = this.removeNumbers(board, this.getRemovalCount());
    // Reinicia los mensajes de solución
    this.solutionChecked = false;
    this.solutionMessage = '';
  }

  // Define cuántos números remover según la dificultad
  getRemovalCount(): number {
    switch (this.difficulty) {
      case 'Easy':
        return 35;
      case 'Medium':
        return 45;
      case 'Hard':
        return 55;
      default:
        return 35;
    }
  }

  // Genera un tablero completo de Sudoku usando backtracking
  generateCompleteBoard(): SudokuCell[][] {
    let board: SudokuCell[][] = Array.from({ length: 9 }, () => Array(9).fill(null).map(() => ({
      value: null,
      possibleValues: [],
      isFixed: false
    })));
    this.fillBoard(board);
    return board;
  }

  // Llena el tablero de Sudoku completamente
  fillBoard(board: SudokuCell[][]): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j].value === null) {
          let numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (this.isSafe(board, i, j, num)) {
              board[i][j].value = num;
              if (this.fillBoard(board)) {
                return true;
              }
              board[i][j].value = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Remueve números del tablero completo para crear el puzzle
  removeNumbers(board: SudokuCell[][], count: number): SudokuCell[][] {
    let puzzle = board.map(row => row.map(cell => ({
      value: cell.value,
      possibleValues: [],
      isFixed: true
    })));
    while (count > 0) {
      console.log('count', count);
      let i = Math.floor(Math.random() * 9);
      let j = Math.floor(Math.random() * 9);
      if (puzzle[i][j].value !== null) {
        let backup = puzzle[i][j].value;
        puzzle[i][j].value = null;
        puzzle[i][j].isFixed = false;

        // Clona el puzzle para resolver
        let puzzleCopy = puzzle.map(row => row.map(cell => ({
          value: cell.value,
          possibleValues: [],
          isFixed: cell.isFixed
        })));
        let solutions = 0;
        this.solveBoard(puzzleCopy, () => solutions++);

        console.log('solutions', solutions);
        if (solutions !== 1) {
          // Si no es único, revertir
          puzzle[i][j].value = backup;
          puzzle[i][j].isFixed = true;
        } else {
          count--;
        }
      }
    }
    return puzzle;
  }

  // Resuelve el tablero de Sudoku y cuenta las soluciones
  solveBoard(board: SudokuCell[][], onSolution: () => void): boolean {
    console.log(SudokuComponent.printBoard(board));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j].value === null) {
          for (let num = 1; num <= 9; num++) {
            if (this.isSafe(board, i, j, num)) {
              board[i][j].value = num;
              if (this.solveBoard(board, onSolution)) {
                onSolution();
              }
              board[i][j].value = null;
            }
          }
          return false;
        }
      }
    }
    //onSolution();
    return true;
  }

  // Comprueba si es seguro colocar un número en una celda
  isSafe(board: SudokuCell[][], row: number, col: number, num: number): boolean {
    // Comprobar fila
    if (board[row].some(cell => cell.value === num)) return false;

    // Comprobar columna
    for (let i = 0; i < 9; i++) {
      if (board[i][col].value === num) return false;
    }

    // Comprobar subcuadrícula 3x3
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j].value === num) return false;
      }
    }

    return true;
  }

  // Mezcla un array de manera aleatoria
  shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Comprueba si la solución del jugador es correcta
  checkSolution(): void {
    this.solutionChecked = true;
    if (this.isSolutionCorrect()) {
      this.solutionMessage = '¡Felicidades! La solución es correcta.';
    } else {
      this.solutionMessage = 'La solución es incorrecta. Revisa las celdas resaltadas.';
    }
  }

  // Valida la solución del tablero
  isSolutionCorrect(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.sudokuBoard[i][j].value === null || !this.isSafeSolution(i, j, this.sudokuBoard[i][j].value!)) {
          return false;
        }
      }
    }
    return true;
  }

  // Comprueba si la posición actual cumple las reglas de Sudoku
  isSafeSolution(row: number, col: number, num: number): boolean {
    // Temporariamente vacía la celda para evitar el conflicto consigo misma
    let temp = this.sudokuBoard[row][col].value;
    this.sudokuBoard[row][col].value = null;

    let valid = this.isSafe(this.sudokuBoard, row, col, num);

    // Restaura el valor original
    this.sudokuBoard[row][col].value = temp;

    return valid;
  }

  // Reinicia el tablero a su estado inicial
  resetBoard(): void {
    this.sudokuBoard = this.initialBoard.map(row => row.map(cell => ({
      value: cell.value,
      possibleValues: [],
      isFixed: cell.isFixed
    })));
    this.solutionChecked = false;
    this.solutionMessage = '';
  }

  // Actualiza el valor en el tablero cuando el usuario ingresa un número
  updateBoard(row: number, col: number, value: string): void {
    if (this.initialBoard[row][col].isFixed) return;

    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 9) {
      this.sudokuBoard[row][col].value = null;
    } else {
      this.sudokuBoard[row][col].value = num;
    }
    this.solutionChecked = false;
    this.solutionMessage = '';
  }

  // Cambia la dificultad y genera un nuevo puzzle
  changeDifficulty(newDifficulty: string): void {
    this.difficulty = newDifficulty;
    this.generatePuzzle();
  }

  // Anota o desanota un valor posible en una celda
  togglePossibleValue(row: number, col: number, val: number): void {
    if (this.initialBoard[row][col].isFixed || this.sudokuBoard[row][col].value !== null) return;

    const index = this.sudokuBoard[row][col].possibleValues.indexOf(val);
    if (index > -1) {
      this.sudokuBoard[row][col].possibleValues.splice(index, 1);
    } else {
      this.sudokuBoard[row][col].possibleValues.push(val);
    }
  }

  static printBoard(board: SudokuCell[][]): string {
    let res: string = '';
    for (let i = 0; i < 9; i++) {
      if(i !== 0 && i % 3 == 0) {
        res += '-----------\n';
      }
      for (let j = 0; j < 9; j++) {
        if(j % 3 == 0 && j != 0) { res += '|'; }
        if(board[i][j].value !== null) {
          res += board[i][j].value;
        } else {
          res += '*';
        }
      }
      res += '\n';
    }
    return res;
  }
}
