import { MomentTransformationsArticleComponent } from './moment-transformations-article.component';
import { PROBABILITY_ARTICLES } from '../probability-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('moment-transformations article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(PROBABILITY_ARTICLES.filter(article=>article===MomentTransformationsArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===MomentTransformationsArticleComponent.route).length).toBe(1);
    for(const number of [82,86]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+MomentTransformationsArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
