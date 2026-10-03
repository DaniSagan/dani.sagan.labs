import { Component, inject } from '@angular/core';
import { NavigationStatusService } from './shared/navigation/navigation-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly navigation = inject(NavigationStatusService);
  title: string = 'dani.sagan.labs';
}
