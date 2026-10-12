import { ExponentialsLogarithmsArticleComponent } from './exponentials-logarithms-article.component';
import { ANALYSIS_ARTICLES } from '../analysis-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('exponentials-logarithms article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(ANALYSIS_ARTICLES.filter(article=>article===ExponentialsLogarithmsArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===ExponentialsLogarithmsArticleComponent.route).length).toBe(1);
    for(const number of [42,51,52,53,59]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+ExponentialsLogarithmsArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
