import { LinearOdeSystemsArticleComponent } from './linear-ode-systems-article.component';
import { CALCULUS_ARTICLES } from '../calculus-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('linear-ode-systems article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(CALCULUS_ARTICLES.filter(article=>article===LinearOdeSystemsArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===LinearOdeSystemsArticleComponent.route).length).toBe(1);
    for(const number of [60,17,20]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+LinearOdeSystemsArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
