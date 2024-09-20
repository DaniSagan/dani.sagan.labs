import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathjaxModule } from 'mathjax-angular';

import { FormsModule } from '@angular/forms';
import { GamesNavbarComponent } from './games-navbar/games-navbar.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { FourInARowComponent } from './four-in-arow/four-in-a-row.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';
import { RouterModule } from '@angular/router';
import { GamesContentComponent } from './games-content/games-content.component';
import { GamesRoutingModule } from './games-routing.module';
// import { GamesRoutingModule } from './games-routing.module';


@NgModule({
    imports: [
    CommonModule,
    // GamesRoutingModule,
    MathjaxModule.forChild(),
    WidgetsModule,
    FormsModule,
    RouterModule,
    GamesRoutingModule,
    GamesNavbarComponent,
    GamesContentComponent,
    TicTacToeComponent,
    FourInARowComponent,
    GameOfLifeComponent
]
})
export class GamesModule { }
