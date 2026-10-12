import { LineCircleArticleComponent } from './line-circle-article.component';
import { GEOMETRY_ARTICLES } from '../geometry-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('line-circle article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(GEOMETRY_ARTICLES.filter(article=>article===LineCircleArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===LineCircleArticleComponent.route).length).toBe(1);
    for(const number of [26,37]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+LineCircleArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
