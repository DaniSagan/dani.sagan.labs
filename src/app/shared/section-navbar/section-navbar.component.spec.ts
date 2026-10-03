import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { SectionNavbarComponent } from './section-navbar.component';
import { ArticlesProviderServiceService } from '../content/articles-provider-service.service';
import { NavbarSubsection } from '../content/navbar-subsection';
import { groupArticleItems } from '../content/article-navigation-groups';

describe('SectionNavbarComponent hierarchy', () => {
  let fixture: ComponentFixture<SectionNavbarComponent>;
  let component: SectionNavbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionNavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(SectionNavbarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Articles');
    fixture.componentRef.setInput('basePath', '/articles');
    fixture.componentRef.setInput('sections', [
      {
        name: 'Geometry',
        items: [],
        subsections: [
          {
            name: 'Triangles',
            items: [],
            subsections: [
              { name: 'Centers', items: [{ name: 'Euler', route: 'euler' }] },
            ],
          },
          { name: 'Areas', items: [{ name: '\u00c1rea', route: 'area' }] },
        ],
      },
      { name: 'Numbers', items: [{ name: 'Euler', route: 'euler-numbers' }] },
    ]);
    fixture.detectChanges();
  });

  it('renders and toggles a branch with three group levels', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button.subsection'),
    ) as HTMLButtonElement[];
    const triangles = buttons.find((button) =>
      button.textContent?.includes('Triangles'),
    )!;
    const centers = buttons.find((button) =>
      button.textContent?.includes('Centers'),
    )!;
    expect(component.totalCount).toBe(3);
    expect(triangles.getAttribute('aria-expanded')).toBe('false');
    triangles.click();
    centers.click();
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector(
      'a[href="/articles/euler"]',
    ) as HTMLAnchorElement;
    expect(link.closest('[hidden]')).toBeNull();
    triangles.click();
    fixture.detectChanges();
    expect(link.closest('[hidden]')).not.toBeNull();
  });

  it('filters descendants without accents and retains their ancestors', () => {
    component.searchTerm = 'area';
    fixture.detectChanges();
    expect(component.resultCount).toBe(1);
    expect(component.filteredSections[0].subsections?.[0].name).toBe('Areas');
    expect(
      fixture.nativeElement.querySelector('a').closest('[hidden]'),
    ).toBeNull();
    expect(component.totalCount).toBe(3);
  });

  it('finds branches by group name and restores expansion after searching', () => {
    component.searchTerm = 'geometry';
    expect(component.resultCount).toBe(2);
    component.searchTerm = 'centers';
    expect(component.resultCount).toBe(1);
    component.searchTerm = '';
    expect(component.isExpanded('/Geometry/Triangles')).toBeFalse();
  });

  it('distinguishes groups with identical names in different branches', () => {
    const first = component.sectionKey('/Geometry', 'Shared');
    const second = component.sectionKey('/Numbers', 'Shared');
    component.toggleSection(first);
    expect(component.isExpanded(first)).toBeTrue();
    expect(component.isExpanded(second)).toBeFalse();
  });

  it('opens all ancestors on initial load and subsequent route changes', () => {
    const events = new Subject<NavigationEnd>();
    const router = { url: '/articles/euler?mode=1#example', events };
    const nav = new SectionNavbarComponent(router as unknown as Router);
    nav.sections = component.sections;
    nav.basePath = '/articles';
    nav.ngOnChanges({ sections: {} as any });
    expect(nav.isExpanded('/Geometry/Triangles/Centers')).toBeTrue();
    expect(nav.isExpanded('/Geometry/Triangles')).toBeTrue();
    expect(nav.isExpanded('/Geometry')).toBeTrue();
    router.url = '/articles/euler-numbers';
    events.next(new NavigationEnd(1, router.url, router.url));
    expect(nav.isExpanded('/Numbers')).toBeTrue();
    nav.ngOnDestroy();
  });

  it('classifies every article in the large sections exactly once', () => {
    const service = TestBed.inject(ArticlesProviderServiceService);
    const flatten = (section: NavbarSubsection): string[] => [
      ...section.items.map((item) => item.route),
      ...(section.subsections ?? []).flatMap(flatten),
    ];
    const sections = service.getNavbar().subsections!;
    for (const items of [
      service.fractals,
      service.numericTheory,
      service.geometry,
      service.curves,
    ]) {
      const section = sections.find((group) =>
        flatten(group).includes(items[0].route),
      )!;
      const routes = flatten(section);
      expect(routes.slice().sort()).toEqual(
        items.map((item) => item.route).sort(),
      );
      expect(new Set(routes).size).toBe(routes.length);
      expect(
        section.subsections!.some((group) => group.name === 'Otros temas'),
      ).toBeFalse();
      expect(
        section.subsections!.every((group) => group.items.length <= 15),
      ).toBeTrue();
    }
  });

  it('keeps new articles accessible until they are classified', () => {
    const item = { name: 'New article', route: 'new-article' };
    expect(groupArticleItems([item], 'fractals')).toEqual([
      { name: 'Otros temas', items: [item] },
    ]);
  });
});
