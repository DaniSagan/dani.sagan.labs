# Googology article

Route: `/articles/googology`. Registered directly in `COMBINATORICS_ARTICLES`;
`ArticlesProviderServiceService` already derives its combinatorics menu from that
registry. The thematic navigation group contains Ramsey, Graham and Googology.
No additional article collection or shared article component is introduced.

The existing Graham article owns the detailed Ramsey problem, distinction between
historical bounds and the popular G, and its arrow and digit laboratories. The new
article is a 1,224-word overview linking to that material and to verified routes for
numeration, exponential/logarithmic functions, asymptotics and modular arithmetic.

The article owns its model, component, template and styles. Only the existing
formula component is reused. SVG charts and native form controls require no new
packages. Supplementary panels mount their contents when opened.

## Mathematical conventions and limits

- H1 is addition, H2 multiplication, H3 exponentiation; H4–H6 use two to four
  Knuth arrows. The factory iterates x(j+1)=Hr(a,x(j)), starting at x0=b.
- Bases 2–10; initial operands 0–6; ranks 1–6; factory applications 1–6.
- Exact calculations stop at 200 decimal digits or 8,000 work units. Temporary
  products have at most 400 digits. Recursion decreases the rank or finite
  hierarchy index; results beyond the budget retain a bounded symbolic expression.
- Towers have heights 0–12, with height zero equal to 1. At most five floors
  are expanded visually; larger heights use compact notation.
- Finite Wainer convention: F0(n)=n+1, F(k+1)(n)=Fk composed n times at n.
  The calculator supports k=0–4 and n=0–12. Ordinal indices are explanatory only.
- Growth charts cover integer n=1–12. Values stored exactly are rounded only for
  drawing; symbolic values are excluded from both ordinary and logarithmic plots.
- Writing estimates accept up to 120 digits in the digit count and display three
  significant figures. The IAU astronomical unit and Julian year are explicit units;
  length per character and writing rate are assumptions.
- Modular calculator: a single ordinary power; nonnegative base up to 30 digits,
  nonnegative exponent up to 100 digits, suffix length 1–12. Zero to zero is rejected.
- Tree embeddings preserve injectivity, label equality and pairwise meets. Mapping
  the source root to the whole target root is not required. Trees have 1–6 nodes,
  three labels and a parent-before-child ordering used only for the editor.
- The tree sequence demonstration checks position-dependent size and forbidden
  earlier-to-later embeddings. It is not an optimiser or TREE(3) calculator.
- Turing machines have two symbols, an initially zero bidirectional tape, a separate
  halt state H and a move on every transition, including entry into H. A run is
  capped at 200 steps; a button advances at most 25. The visible tape is a 15-cell
  window, while the ones counter includes the whole simulated tape.
- S counts steps, Sigma counts final ones. The three-state 21-step example writes
  five ones; Sigma(3)=6 is attained by a different machine.

## Sources

References are linked alongside the relevant article text and in its source panel.
The Busy Beaver review is dated 2026-10-12, with the formally checked S(5) and
Sigma(5) from the 2025 bbchallenge paper. The paper's S(6) lower bound is explicitly
not described as a current record or an exact value. Six-state exact values remain
open in the consulted project sources. Rayo's strict less-than-googol symbol bound
uses his formal definition rather than the informal paraphrase on the same page.

## Validation

```sh
npm run test:googology
npm run build -- --configuration=development
node scripts/check-googology-page.cjs
```

The model tests compare modular calculations against direct small powers, test
bounded hyperoperations and hierarchy values, verify meet-preserving embeddings,
run the predefined machines, justify all challenge answers, check learning routes
and exercise the full factory control grid. Browser checks exercise actual inputs,
all panels and milestones, formulas, routes, menu, and 1440/768/390-pixel widths.
The browser check can use a temporary copy of the existing MathJax 3.2.2 tex-svg
bundle if the CDN is unavailable. Set `MATHJAX_TEST_BUNDLE` to its absolute path,
or use the default temporary filename `danisagan-mathjax-3.2.2-tex-svg.js`. Only
the test browser substitutes the CDN startup request; application code and
production dependencies remain unchanged. This run verified 23 rendered formulas.