import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ArticlesModule } from './articles/articles.module';
import { GamesModule } from './games/games.module';
import { ArticlesContentComponent } from './articles/articles-content/articles-content.component';
//import { ArticlesRoutingModule } from './articles/articles-routing.module';
import { routes as articleRoutes} from './articles/routes'
import { GamesContentComponent } from './games/games-content/games-content.component';
import { routes as gameRoutes } from './games/routes'

const routes: Routes = [
  //{ path: 'articles', loadChildren: () => ArticlesModule },
  { path: 'articles', component: ArticlesContentComponent, children: articleRoutes },
  //{ path: 'games', loadChildren: () => GamesModule },
  { path: 'games', component: GamesContentComponent, children: gameRoutes },
  { path: '', redirectTo: '/articles/home', pathMatch: 'full' }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
