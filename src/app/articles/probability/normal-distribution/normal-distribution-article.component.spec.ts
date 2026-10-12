import { NormalDistributionArticleComponent } from './normal-distribution-article.component';
import { PROBABILITY_ARTICLES } from '../probability-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('normal-distribution article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(PROBABILITY_ARTICLES.filter(article=>article===NormalDistributionArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===NormalDistributionArticleComponent.route).length).toBe(1);
    for(const number of [87,88,89]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+NormalDistributionArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
