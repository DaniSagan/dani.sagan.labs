import { Component } from '@angular/core';
import { ArticlesProviderServiceService } from 'src/app/shared/content/articles-provider-service.service';
import { Navbar } from 'src/app/shared/content/navbar';
import { SectionNavbarComponent } from 'src/app/shared/section-navbar/section-navbar.component';

@Component({
  selector: 'app-articles-navbar',
  templateUrl: './articles-navbar.component.html',
  styleUrls: ['./articles-navbar.component.css'],
  standalone: true,
  imports: [SectionNavbarComponent],
})
export class ArticlesNavbarComponent {
  navbar!: Navbar;
  readonly sidebarId = 'sidebar-toggle-articles';

  constructor(private articlesProviderService: ArticlesProviderServiceService) {
    this.navbar = this.articlesProviderService.getNavbar();
  }

}
