import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangtonsAntLabComponent } from './langtons-ant-lab.component';

@Component({ selector: 'app-langtons-ant-article', standalone: true, imports: [RouterLink, LangtonsAntLabComponent],
  templateUrl: './langtons-ant-article.component.html', styleUrl: '../../number-theory/gcd-euclid/gcd-euclid-article.component.css' })
export class LangtonsAntArticleComponent {
  static title = 'La hormiga de Langton: el orden que emerge del caos';
  static route = 'langtons-ant';
}
