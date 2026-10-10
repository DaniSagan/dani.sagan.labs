import { PROBLEMS, PROBLEM_BLOCKS, PROBLEM_NAVIGATION, PROBLEM_COMPONENTS } from './problems.data';

describe('Problem collection integrity', () => {
  it('contains exactly 100 distinct exercises with their own components in twenty navigable subtopics', () => {
    expect(PROBLEMS.length).toBe(100);
    expect(PROBLEM_COMPONENTS.length).toBe(100);
    expect(new Set(PROBLEM_COMPONENTS).size).toBe(100);
    expect(new Set(PROBLEMS.map(p => p.id)).size).toBe(100);
    expect(new Set(PROBLEMS.map(p => p.title)).size).toBe(100);
    expect(PROBLEM_BLOCKS.length).toBe(10);
    const links = PROBLEM_NAVIGATION.flatMap(group => group.subsections!.flatMap(topic => topic.items));
    expect(links.map(link => link.route)).toEqual(PROBLEMS.map(p => p.id));
    PROBLEMS.forEach((problem, index) => {
      expect(problem.number).toBe(index + 1);
      expect(['Repaso', 'Oposición', 'Reto']).toContain(problem.level);
      expect(problem.statement.length).toBeGreaterThan(25);

      const component = PROBLEM_COMPONENTS[index];
      expect(component.route).toBe(problem.id);
      expect(component.title).toBe(problem.title);
      expect(component.problem).toBe(problem);
      expect(problem.resources.some(resource => resource.route.startsWith('/articles/'))).toBeTrue();
    });
  });
  it('connects all nine tools and six games to a study activity', () => {
    const resources = PROBLEMS.flatMap(problem => problem.resources);
    for (const route of ['graph-plotter','prime-decomposition','pi-decimals','implicit-curve-graph',
      'vector-field','linear-algebra','probability-lab','sun-position','travel-planner']) {
      expect(resources.some(resource => resource.route === '/tools/' + route && resource.activity.length > 25)).toBeTrue();
    }
    for (const route of ['tic-tac-toe','four-in-a-row','game-of-life','rubik-cube','sudoku','gravity']) {
      expect(resources.some(resource => resource.route === '/games/' + route && resource.activity.length > 25)).toBeTrue();
    }
  });
});
