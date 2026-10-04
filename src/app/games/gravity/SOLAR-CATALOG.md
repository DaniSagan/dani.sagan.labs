# Solar catalogue

Snapshot retrieved on 2026-10-03, embedded locally; the simulator makes no runtime requests.

- [JPL mean satellite elements](https://ssd.jpl.nasa.gov/sats/elem/): all 460 rows, including provisional designations. Earth 1, Mars 2, Jupiter 115, Saturn 291, Uranus 30, Neptune 16, Pluto 5.
- [JPL satellite physical parameters](https://ssd.jpl.nasa.gov/sats/phys_par/): published GM and radii, matched by satellite code. Unknown values stay zero and are explicitly displayed as unavailable. A missing mass means a gravitational test particle; a missing radius means no physical sphere, only an optional selection marker.
- [JPL SBDB](https://ssd-api.jpl.nasa.gov/doc/sbdb.html): orbital elements, periods, epochs and available physical data for Ceres, Pluto, Eris, Haumea, Makemake; candidate dwarf planets Quaoar, Orcus, Gonggong, Sedna; and asteroids Pallas, Vesta, Hygiea, Psyche, Lutetia, Eros, Ida, Gaspra, Mathilde, Itokawa, Bennu, Ryugu, Apophis, Didymos. Parameters: `sstr=<number>&phys-par=true&full-prec=true`.
- [NASA dwarf planets](https://science.nasa.gov/dwarf-planets/): classification and rounded physical sizes. Haumea uses a representative equivalent spherical radius, not its real triaxial shape.
- [Ragozzine & Brown (2009)](https://arxiv.org/abs/0903.4213): supplementary Hiʻiaka and Namaka orbit sizes, eccentricities, periods, and approximate masses.
- [Holler et al. (2021)](https://arxiv.org/abs/2009.13733): supplementary Dysnomia orbit.
- [Grundy (2025)](https://arxiv.org/abs/2509.05880): preliminary MK 2 orbit. Makemake's approximate system mass is inferred from the reported semimajor axis and period via Kepler's third law.

The catalogue covers all moons with elements in the cited JPL planetary table plus the four known satellites of Eris, Haumea, and Makemake. It does not claim to catalogue asteroid satellites or every recently reported object without published orbital elements. The four extra trans-Neptunian objects are labelled candidates, not officially recognised dwarf planets.

The educational initial state is expressed at J2000. Mean elements are propagated with Kepler's equation and transformed from ecliptic, equatorial or local Laplace planes. Equatorial poles used for Uranus and Pluto are approximate IAU J2000 values. Supplementary satellites have illustrative phases and orientations; these are not ephemerides. Eight main planets retain circular initial orbits.

The calendar uses 2000-01-01 12:00:00 UTC as the educational reference. The UTC picker is parsed explicitly with a `Z` suffix, independently of the browser's timezone. Selecting a date pauses the simulation and recomputes preset orbital phases at that epoch; for custom systems it dates the existing state without moving bodies. The model clock advances by the time actually integrated, and saved version-2 snapshots include the exact UTC timestamp. Legacy body-array saves remain supported with the reference date. This approximation does not convert between UTC and TDB/TT or model leap seconds.

After initialisation, Newtonian pairwise acceleration and leapfrog integration evolve all bodies, including test particles. The renderer shows physical radii in AU. Full reference ellipses translate with the host and are distinct from the integrated trails. With hundreds of close moons, the numerical step and a 12 ms per-frame integration budget limit effective simulated time to preserve interaction responsiveness.
