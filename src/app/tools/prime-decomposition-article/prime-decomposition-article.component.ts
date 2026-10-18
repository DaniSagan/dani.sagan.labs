import { Component, OnInit } from '@angular/core';
import { PrimeDecompositionComponent } from '../../widgets/prime-decomposition/prime-decomposition.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prime-decomposition-article',
  templateUrl: './prime-decomposition-article.component.html',
  styleUrls: ['./prime-decomposition-article.component.css'],
  standalone: true,
  imports: [PrimeDecompositionComponent, RouterLink],
})
export class PrimeDecompositionArticleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
