# grahams-gents-barbers

Independent zero-dependency static site for Henry Goldsmith. Open index.html via any static server. No build or paid services required.

## Functional scope
Forms prepare a visible request or call note. Email links open the visitor's email app; no message is automatically sent. A reference is local, not a server booking. No payments, confirmed bookings, delivery promises or invented prices.

## Before owner launch
Confirm contact details, hours, service/menu content and accessibility needs with the owner. Replace the candidate GitHub Pages canonical/social URLs with the actual deployment URL. Search indexing is blocked by robots.txt pending owner launch approval. Remove that block and submit sitemap.xml only at approved launch. No real merchant checkout is configured.

## Security and privacy
No third-party scripts, fonts, trackers or card handling. Executable JavaScript is self-hosted and CSP permits only self scripts. Form input is escaped or inserted as text. Gift shortlists use localStorage; visit details stay in the current tab.

Prepared 15 November 2026.

## Verification — 15 November 2026
Browser checks: 375px, 390px, 768px and 1440px widths; no horizontal overflow. Form flows exercised without sending an email or calling. All local assets, scripts, JSON-LD, single h1 and external-link protections checked. Not tested: live telephone ownership, owner acceptance, live checkout, Safari/Firefox, Lighthouse, formal WCAG certification or Google Rich Results.

## 15 November 2026: reference-led design and evidence pass
See DESIGN.md for sources, design decisions and attribution. Live Maps and publicly accessible social details were audited; full private/social archives were not accessible. Site changes use confirmed details, original code-native illustrations and keyboard/touch interaction. No client launch or payments enabled.
## Final polish — 15 November 2026
Scroll-reveal section entrances (IntersectionObserver, reduced-motion safe), pointer parallax on the hero visual (fine-pointer only), Daisy shortlist-count pop feedback, and added structured data: contactPoint, hasOfferCatalog (barbers) and FAQPage schema, plus og:locale/og:site_name/twitter parity and sentence-case ribbon copy. All zero-dependency, still no pricing or unverified claims. Verified one h1, strict script policy, no overflow at 375/768/1440/1920, and keyboard/touch flows.

## Vibrancy pass — 15 November 2026
Brand-specific vibrancy layer appended to site.css: richer gradients and section depth, gradient headline/section headings, gradient primary buttons and glowing hover/selection states. All zero-dependency; respects prefers-reduced-motion; strict CSP unchanged; one h1 retained; no unverified claims added.

## Cleanup — 16 November 2026
Removed the unused scroll-reveal/parallax/pop CSS from site.css and the matching `data-reveal` attributes: no script ever activated them, superseding the decorative-motion notes above. Removed inert card-rack logic from direction.js. Preloaded Fraunces alongside DM Sans, set the web app name to the business name, added `aria-live="polite"` to the once-a-minute visit-status text, and replaced a hard-coded 2026 date used to name weekdays with a direct lookup. No business details, flows or launch settings changed.

## Second cleanup — 16 November 2026
Removed branches that could never run on this site: the Best Cut `studio` hour variants in app.js and experience.js (the body class here is `heritage`), and the photo-gallery/dialog module in refinement.js (this page has no gallery). The nav highlight — the only part that ran — is unchanged. Visit-note validation and listed opening hours are identical.

## Third cleanup — 16 November 2026
Trimmed experience.js to the three behaviours this page uses: service selection, the visit-status clock and the copy helper. Card-rack and booking-form code (and the `SiteUX.iso`/`pretty` helpers they alone used) had no matching elements here. Consolidated the two HairSalon JSON-LD blocks into one node with `hasOfferCatalog` and dropped the empty `sameAs` array; the business facts and offer list are unchanged.

## Shared London clock — 16 November 2026
`SiteUX.london()` now derives London wall-clock fields with `Intl.DateTimeFormat` rather than parsing a locale-formatted string, and `SiteUX.iso()` is shared with app.js. Loaded experience.js before app.js so the single helper is available at startup. The date input refreshes its min/max on focus, and submit recomputes the 120-day ceiling instead of trusting a stale attribute. Business rules and displayed hours unchanged.

## Dead files — 16 November 2026
Removed four source files that no HTML, CSS or JavaScript in this repo referenced: `style.css`, `direction.css`, `visit-collection.css` and `visit-collection.js` (about 28 KB). Their live rules are already present in the loaded stylesheets. Generated and source assets, including `assets/share-source.html`, were kept.

## Radiogroup for hero services — 16 November 2026
The four mutually exclusive hero service buttons are now a labelled ARIA radiogroup with `aria-checked`, a single tab stop and Arrow/Home/End navigation; the selected styling and form sync are unchanged. Audited in the browser: radios expose the right names/states, arrow keys move selection and focus, and the selected button keeps its cream background. Hostile form input still renders as literal text.

## Hint and live feedback — 16 November 2026
Associated the preferred-time hint with its field via `aria-describedby`, and made the service-copy line a polite live region so keyboard and screen-reader users hear the selection change. Re-checked that a valid note still builds and that editing a field hides stale output.

## Tests — 16 November 2026
Added `tests/structure.test.js`, a dependency-free contract suite run with `node tests/structure.test.js`. It checks the single h1 and unique IDs, local asset and CSS references, JSON-LD and opening hours, strict CSP, script order, radiogroup semantics, field labels and hint association, safe external links, the manifest name, the pre-launch indexing block and absence of the removed legacy modules. All 12 checks pass; a deliberate mutation of the radiogroup role was caught by the suite.

## Status and highlight polish — 16 November 2026
The navigation observer now clears `aria-current` when no observed section is in view, instead of leaving the last section highlighted. The visit-status line writes only when its text actually changes (so the polite live region is not re-announced every minute) and re-renders when a hidden tab becomes visible again. Browser re-check: status stays correct and unchanged across a visibility event; no console errors. Scroll-driven highlight was not re-verified because this session's browser tool could not scroll the tab.

## Test suite extended — 16 November 2026
The contract suite now has 14 checks, adding assertions that the honeypot is hidden from assistive tech and keyboard users, and that no third-party runtime asset or inline event handler is present. Two first-draft assertions were wrong (the `aria-hidden` sits on the wrapper, and `canonical` is a metadata link, not a runtime asset); both were corrected after the suite caught them rather than loosening the check.

## Not-found page — 16 November 2026
`404.html` now uses the site stylesheet, the same self-only CSP and a `noindex` flag. It offers a styled route home and the shop's phone number instead of bare browser defaults. Browser-rendered with no console errors; the contract suite includes the fallback and now also checks that og-image.png is 1200×630 and sitemap.xml matches the canonical URL. 16 checks pass.

## CSS prune — 16 November 2026
Removed style rules whose selectors referenced only class names present in neither the HTML nor the loaded JavaScript, saving about 14 KB (roughly a quarter of the loaded CSS). The loaded sheets were served side by side before and after: all 134 rendered elements had identical computed styles, with no console errors and working service selection, note building and menu behaviour. The contract suite now also checks that every static class keeps a CSS rule.
