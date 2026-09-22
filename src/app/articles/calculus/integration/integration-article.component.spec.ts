import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MathjaxModule } from 'mathjax-angular';
import { IntegrationArticleComponent } from './integration-article.component';
import { INTEGRATION_CHAPTERS } from './integration-content';

describe('Integration article series', () => {
  let previousMathJax: any;
  beforeEach(() => {
    // Keep the real HTML-inserting directive, but prevent its module from
    // replacing the deterministic test typesetter with a CDN script.
    spyOn(MathjaxModule.prototype as any, 'addConfigToDocument');
    spyOn(MathjaxModule.prototype as any, 'addMatjaxToDocument');
    previousMathJax = (window as any).MathJax;
    (window as any).MathJax = {
      isReady: true,
      startup: { promise: Promise.resolve() },
      typesetPromise: () => Promise.resolve(),
    };
    TestBed.configureTestingModule({
      imports: [MathjaxModule.forRoot()],
      providers: [provideRouter([])],
    });
  });
  afterEach(() => { (window as any).MathJax = previousMathJax; });

  for (const chapter of INTEGRATION_CHAPTERS) {
    it(`renders ${chapter.route} with navigable methods and working labs`, async () => {
      const fixture = TestBed.createComponent(IntegrationArticleComponent);
      fixture.componentRef.setInput('chapter', chapter);
      fixture.detectChanges();
      // The real directive inserts its input as HTML before asking MathJax to
      // typeset it. Wait for that insertion even though the test typesetter is a stub.
      await (window as any).MathJax.startup.promise;
      const root: HTMLElement = fixture.nativeElement;
      expect(root.querySelector('h2')?.textContent).toBe(chapter.title);
      expect(root.querySelectorAll('app-formula').length).toBe(
        chapter.methods.length,
      );
      for (const method of chapter.methods) {
        expect(root.querySelector(`#${method.id}`)).not.toBeNull();
        expect(
          root.querySelector(`#${method.id} .jax-process`)?.textContent,
        ).withContext(method.id).toBe(`$$ ${method.formula} $$`);
        expect(
          root.querySelector(
            `a[href="/articles/${chapter.route}#${method.id}"]`,
          ),
        ).not.toBeNull();
      }
      expect(root.querySelectorAll('app-integration-lab').length).toBe(
        chapter.route === 'integration-classical'
          ? 1
          : chapter.route === 'integration-advanced'
            ? 3
            : 2,
      );
      const selector = root.querySelector('select')!;
      selector.value = 'oscillation';
      selector.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(root.querySelector('.guide a')?.getAttribute('href')).toBe(
        '/articles/integration-numerical#oscillatory',
      );
      expect(root.innerHTML).not.toContain('NaN');
      fixture.destroy();
    });
  }
});
