import { DerivativeFoundationsArticleComponent } from './derivative-foundations-article.component';
import { CALCULUS_ARTICLES } from '../calculus-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('derivative-foundations article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(CALCULUS_ARTICLES.filter(article=>article===DerivativeFoundationsArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===DerivativeFoundationsArticleComponent.route).length).toBe(1);
    for(const number of [48,49,51,52,53,54,55,56,57,58]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+DerivativeFoundationsArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
