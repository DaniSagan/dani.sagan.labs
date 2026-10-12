import { ZeroMeasureDimensionArticleComponent } from './zero-measure-dimension-article.component';
import { FRACTALS_ARTICLES } from '../fractals-articles';
import { PROBLEMS } from '../../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../../shared/content/navbar-subsection';

describe('zero-measure-dimension article integration',()=>{
  it('registers the article once and keeps its reciprocal problem references',()=>{
    const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
    const nav=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
    expect(FRACTALS_ARTICLES.filter(article=>article===ZeroMeasureDimensionArticleComponent).length).toBe(1);
    expect(nav.filter(route=>route===ZeroMeasureDimensionArticleComponent.route).length).toBe(1);
    for(const number of [100]) {
      expect(PROBLEMS.find(problem=>problem.number===number)!.resources.filter(resource=>resource.route==='/articles/'+ZeroMeasureDimensionArticleComponent.route).length).withContext('Problem '+number).toBe(1);
    }
  });
});
