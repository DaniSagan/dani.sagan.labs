import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarSubsection } from '../content/navbar-subsection';

@Component({
  selector: 'app-section-navbar',
  standalone: true,
  imports: [NgTemplateOutlet, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './section-navbar.component.html',
  styleUrl: './section-navbar.component.css'
})
export class SectionNavbarComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) title = '';
  @Input({ required: true }) basePath = '';
  @Input({ required: true }) sections: NavbarSubsection[] = [];
  @Input() sidebarId = 'sidebar-toggle';

  searchTerm = '';
  private readonly expandedSections = new Set<string>();

  private readonly navigationSubscription: Subscription;

  constructor(private readonly router: Router) {
    this.navigationSubscription = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.openInitialSection(false);
    });
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  sectionKey(parent: string, name: string): string {
    return parent + '/' + encodeURIComponent(name);
  }

  countItems(section: NavbarSubsection): number {
    return section.items.length + (section.subsections ?? []).reduce(
      (total, child) => total + this.countItems(child), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sections']) {
      this.openInitialSection();
    }
  }

  get filteredSections(): NavbarSubsection[] {
    const query = this.normalize(this.searchTerm);

    return this.filterSections(this.sections, query);
  }

  private filterSections(sections: NavbarSubsection[], query: string): NavbarSubsection[] {
    return sections.map(section => {
      const childQuery = this.normalize(section.name).includes(query) ? '' : query;
      return {
        ...section,
        items: section.items.filter(item => !childQuery || this.normalize(item.name).includes(childQuery)),
        subsections: this.filterSections(section.subsections ?? [], childQuery)
      };
    }).filter(section => this.countItems(section) > 0);
  }

  get totalCount(): number {
    return this.sections.reduce((total, section) => total + this.countItems(section), 0);
  }

  get resultCount(): number {
    return this.filteredSections.reduce((total, section) => total + this.countItems(section), 0);
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

  private openInitialSection(fallback = true): void {
    const currentPath = this.router.url.split(/[?#]/)[0];
    const visit = (sections: NavbarSubsection[], parent: string): boolean => {
      for (const section of sections) {
        const key = this.sectionKey(parent, section.name);
        const activeChild = visit(section.subsections ?? [], key);
        if (activeChild || section.items.some(item => currentPath === `${this.basePath}/${item.route}`)) {
          this.expandedSections.add(key);
          return true;
        }
      }
      return false;
    };
    if (!visit(this.sections, '') && fallback) {
      const first = this.sections.find(section => this.countItems(section) > 0);
      if (first) this.expandedSections.add(this.sectionKey('', first.name));
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
