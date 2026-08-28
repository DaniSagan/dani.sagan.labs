import { Component, OnInit } from '@angular/core';
import { ArticlesProviderServiceService } from 'src/app/shared/content/articles-provider-service.service';
import { Navbar } from 'src/app/shared/content/navbar';
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
  readonly sidebarId = 'sidebar-toggle-articles';

  constructor(private articlesProviderService: ArticlesProviderServiceService) {
    this.navbar = this.articlesProviderService.getNavbar();
  }

  closeSidebar(): void {
    const checkbox = document.getElementById(this.sidebarId) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }

  ngOnInit(): void {}
}
