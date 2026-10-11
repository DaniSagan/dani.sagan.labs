import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-daylight-saving-time-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './daylight-saving-time-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class DaylightSavingTimeArticleComponent {
  static readonly title = "Horario estacional y horas locales ambiguas";
  static readonly route = "daylight-saving-time";
}
