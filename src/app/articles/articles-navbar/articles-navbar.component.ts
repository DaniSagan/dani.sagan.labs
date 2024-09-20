import { Component, OnInit } from '@angular/core';
import { ArticlesProviderServiceService } from 'src/app/shared/content/articles-provider-service.service';
import { Navbar } from 'src/app/shared/content/navbar';
import { NavbarSubsection } from 'src/app/shared/content/navbar-subsection';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-articles-navbar',
  templateUrl: './articles-navbar.component.html',
  styleUrls: ['./articles-navbar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class ArticlesNavbarComponent implements OnInit {
  navbar!: Navbar;

  constructor(private articlesProviderService: ArticlesProviderServiceService) {
    this.navbar = this.articlesProviderService.getNavbar();
  }

  ngOnInit(): void {}
}
