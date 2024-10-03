import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { FourInARowComponent } from './four-in-arow/four-in-a-row.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { GamesContentComponent } from './games-content/games-content.component';
import { RubikCubeComponent } from './rubik-cube/rubik-cube.component';
import { SudokuComponent } from './sudoku/sudoku.component';

const routes: Routes = [
  {
    path: '',
    component: GamesContentComponent,
    children: [
      {path: 'tic-tac-toe', component: TicTacToeComponent},
      {path: 'four-in-a-row', component: FourInARowComponent},
      {path: 'game-of-life', component: GameOfLifeComponent},
      {path: 'rubik-cube', component: RubikCubeComponent},
      {path: 'sudoku', component: SudokuComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
