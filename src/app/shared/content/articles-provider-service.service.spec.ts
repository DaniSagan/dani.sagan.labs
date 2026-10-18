import { TestBed } from '@angular/core/testing';
import { ROUTES, Routes } from '@angular/router';
import { ArticlesRoutingModule } from '../../articles/articles-routing.module';
import { ArticlesProviderServiceService } from './articles-provider-service.service';
import { NavbarSubsection } from './navbar-subsection';

function menuItems(sections: NavbarSubsection[]): { name: string; route: string; groups: string[] }[] {
  return sections.flatMap(section => [
    ...section.items.map(item => ({ ...item, groups: [section.name] })),
    ...menuItems(section.subsections ?? []).map(item => ({ ...item, groups: [section.name, ...item.groups] })),
  ]);
}

function routedPages(routes: Routes): string[] {
  return routes.flatMap(route => [
    ...(route.path && route.path !== '**' && !route.redirectTo ? [route.path] : []),
    ...routedPages(route.children ?? []),
  ]);
}

describe('Article navigation coverage', () => {
  let service: ArticlesProviderServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ArticlesRoutingModule] });
    service = TestBed.inject(ArticlesProviderServiceService);
  });

  it('includes every routed article exactly once, without links to missing routes', () => {
    const actual = menuItems(service.getNavbar().subsections ?? []).map(item => item.route);
    const expected = routedPages(TestBed.inject(ROUTES).flat());
    expect(actual.length).toBeGreaterThan(400);
    expect(new Set(actual).size).toBe(actual.length);
    expect(actual.sort()).toEqual(expected.sort());
  });

  it('places covariance in the descriptive statistics and dependence group', () => {
    const covariance = menuItems(service.getNavbar().subsections ?? []).find(item => item.route === 'covariance');
    expect(covariance?.name).toContain('Covarianza');
    expect(covariance?.groups).toEqual(['Probabilidad', 'Estadística descriptiva y dependencia']);
  });
});
