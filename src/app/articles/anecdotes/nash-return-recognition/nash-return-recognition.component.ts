import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-nash-return-recognition', standalone: true, imports: [RouterLink], templateUrl: './nash-return-recognition.component.html', styleUrls: ['../../shared/learning-article.css', './nash-return-recognition.component.css'] })
export class NashReturnRecognitionComponent {
  static readonly title = "John Nash: el reconocimiento que llegó cuatro décadas después";
  static readonly route = 'nash-return-recognition';
}
