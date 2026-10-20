import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector: 'app-classical-cryptography-article', standalone: true, imports: [RouterLink], templateUrl: './classical-cryptography-article.component.html', styleUrls: ['../../shared/learning-article.css']})
export class ClassicalCryptographyArticleComponent {
 static readonly title = "Criptografía clásica: sustituciones, claves e indicios";
 static readonly route = 'classical-cryptography';
}
