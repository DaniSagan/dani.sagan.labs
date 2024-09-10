import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathjaxModule } from 'mathjax-angular';
import { MathematicsModule } from '../mathematics/mathematics.module';
import { FormsModule } from '@angular/forms';
import { GamesNavbarComponent } from './games-navbar/games-navbar.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { FourInARowComponent } from './four-in-arow/four-in-a-row.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { RouterModule } from '@angular/router';
import { GamesContentComponent } from './games-content/games-content.component';
// import { GamesRoutingModule } from './games-routing.module';


@NgModule({
  declarations: [
    GamesNavbarComponent,
    GamesContentComponent,
    TicTacToeComponent,
    FourInARowComponent,
    GameOfLifeComponent,
  ],
  imports: [
    CommonModule,
    // GamesRoutingModule,
    MathjaxModule.forChild(),
    MathematicsModule,
    WidgetsModule,
    FormsModule,
    RouterModule
  ]
})
export class GamesModule { }
