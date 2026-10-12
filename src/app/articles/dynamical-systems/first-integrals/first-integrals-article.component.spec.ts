import { FirstIntegralsArticleComponent } from './first-integrals-article.component';
import { DYNAMICAL_SYSTEMS_ARTICLES } from '../dynamical-systems-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('first-integrals article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(DYNAMICAL_SYSTEMS_ARTICLES.filter(article=>article===FirstIntegralsArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===FirstIntegralsArticleComponent.route).length).toBe(1);
    for(const number of [60,97]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+FirstIntegralsArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
