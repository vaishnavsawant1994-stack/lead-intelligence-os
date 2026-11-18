# Browser route inventory — scope of test coverage

This repository now has two complementary Chromium checks:

1. `scripts/browser-qa.mjs` exercises core **real interactions**: login, company and people creation, search, mobile navigation, keyboard navigation, logout; screenshots for 12 representative desktop+mobile screens.
2. `scripts/route-browser-audit.mjs` visits **every static page route** at desktop 1440px and mobile 390px, counting headers, buttons, anchors, unlabeled buttons and placeholder links, detecting browser exceptions and page overflow, and saving detailed `browser-audit/all-routes.json` and `browser-audit/issues.json` artifacts.

**Important limits:** Automated page visits do NOT make every button functional. Demo pages may have inert controls and static data. The route sweep gates CI only on critical preview pages; unqualified routes with warnings appear in the audit artifact and must be addressed before public release.

Pixel-perfect comparisons require approved design references per route and viewport. Current screenshots are reproducible baselines, not fidelity certificates.

The project must remain a private preview until server-side user roles/tenant controls, privacy, real integrations and browser acceptance are qualified. Hostinger deployment requires authenticated hosting access and is not verified.
