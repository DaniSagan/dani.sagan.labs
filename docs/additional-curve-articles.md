# Additional curve articles

The curves catalogue contains the original 20 articles and 100 additional articles,
organised into 17 thematic navigation groups. Each group currently contains at most
10 articles. This is an editorial navigation guideline, not a runtime limit.

Each new article owns its standalone Angular component, HTML template and CSS file
under `src/app/articles/curves/<slug>-article/`. The article component implements its
own equation, parameter handling and drawing. Existing formula and graph widgets
provide the same visual language as the other curve articles.

All 120 components are registered directly in `curves-articles.ts`. The provider
and navigation files declare their entries and thematic groups directly, following
the existing catalogue structure. There is no separate collection for the new articles.

The authoring script `scripts/generate-additional-curve-articles.cjs` records the
initial article content and emits the independent files. It is never imported by
the application. Running it again overwrites those generated files; preserve manual
article changes before regenerating.

Validation:

```sh
npm run test:curve-articles
npm run build -- --configuration=development
npm run test:curve-pages
```

The model checks cover unique routes, individual components, group sizes, visible
curves at parameter bounds, singularities and selected mathematical identities and
numerical reference values. The browser check requires Google Chrome (or `CHROME_BIN`)
and a development build; it visits menu destinations, checks drawings and parameter
controls, and checks mobile overflow and JavaScript exceptions.
