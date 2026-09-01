import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarSubsection } from '../content/navbar-subsection';

@Component({
  selector: 'app-section-navbar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './section-navbar.component.html',
  styleUrl: './section-navbar.component.css'
})
export class SectionNavbarComponent implements OnChanges {
  @Input({ required: true }) title = '';
  @Input({ required: true }) basePath = '';
  @Input({ required: true }) sections: NavbarSubsection[] = [];
  @Input() sidebarId = 'sidebar-toggle';

  searchTerm = '';
  private readonly expandedSections = new Set<string>();

  constructor(private readonly router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sections']) {
      this.openInitialSection();
    }
  }

  get filteredSections(): NavbarSubsection[] {
    const query = this.normalize(this.searchTerm);

    return this.sections
      .map(section => ({
        ...section,
        items: query
          ? section.items.filter(item => this.normalize(item.name).includes(query))
          : section.items
      }))
      .filter(section => section.items.length > 0);
  }

  get resultCount(): number {
    return this.filteredSections.reduce((total, section) => total + section.items.length, 0);
  }

  isExpanded(sectionName: string): boolean {
    return this.searchTerm.trim().length > 0 || this.expandedSections.has(sectionName);
  }

  toggleSection(sectionName: string): void {
    if (this.expandedSections.has(sectionName)) {
      this.expandedSections.delete(sectionName);
    } else {
      this.expandedSections.add(sectionName);
    }
  }

  clearSearch(searchInput: HTMLInputElement): void {
    this.searchTerm = '';
    searchInput.focus();
  }

  closeSidebar(): void {
    const checkbox = document.getElementById(this.sidebarId) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }

  private openInitialSection(): void {
    const currentRoute = this.router.url.split(/[?#]/)[0].split('/').filter(Boolean).pop();
    const activeSection = this.sections.find(section =>
      section.items.some(item => item.route === currentRoute)
    );
    const fallbackSection = this.sections.find(section => section.items.length > 0);
    const initialSection = activeSection ?? fallbackSection;

    if (initialSection) {
      this.expandedSections.add(initialSection.name);
    }
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();
  }
}
