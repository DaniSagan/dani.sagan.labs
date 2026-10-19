import { HardyRamanujanTaxicabComponent } from './hardy-ramanujan-taxicab/hardy-ramanujan-taxicab.component';
import { GaussSchoolSumComponent } from './gauss-school-sum/gauss-school-sum.component';
export const ANECDOTES_ARTICLES = [GaussSchoolSumComponent, HardyRamanujanTaxicabComponent] as const;
export const ANECDOTES_NAV_ITEMS = ANECDOTES_ARTICLES.map(article => ({ name: article.title, route: article.route }));
