# Design and public-source audit — 15 November 2026

Henry replaced the proposed oxblood scheme with real shop references: gold lettering, black frame and pale-blue interior.

## Applied guidance
Unslop by Damir Sokolovsky (@heydamir), CC BY 4.0: https://github.com/heydamir/unslop
Anthropic frontend-design: https://github.com/anthropics/skills/tree/main/skills/frontend-design
UI/UX Pro Max was explicitly excluded by Henry.

Inspiration: https://www.inspora.design/posts/3d-website-with-claude-code ; https://www.inspora.design/posts/portfolio-website ; https://studio.motionsites.ai/explore/vasari-vhs-hero
No template code, source photographs or commercial assets copied. Illustrations are original SVG/CSS, not inventory or premises photographs.

## Evidence
Contact details, expanded hours and coordinates were checked directly on Google Maps on 15 November 2026. Current Maps Saturday close is 13:00, agreeing with Fresha; the supplied July 2020 photo shows older hours and is not used for current scheduling.

Full source URLs, dates, queries, conflicting claims and access limits are preserved in shared prospect records. Social timelines are partially login-gated; no claim of complete private/archive access. No prices, current inventory, dietary guarantees or review quotes added.

## Implementation
4px spacing rhythm, quieter navigation, sentence-case labels, one primary hero action, subject-specific composition, native form controls, touch/keyboard controls and reduced-motion support. Original booking/enquiry flows retained. Zero third-party runtime, tracking or paid dependencies.

## Verified outcomes — 15 November 2026
Browser widths: 375, 390, 768, 1440 and 1920px; no horizontal overflow. Mobile menu opens and closes on Escape. Primary hero and menu targets are at least 44px tall on 375px. CSS and JS return 200 locally; one h1, labelled fields, strict script policy and safe external links verified. Tested call-note preparation and safe literal rendering of angle-bracket input. No email or phone call initiated.

Not verified: Safari/Firefox, Lighthouse score, formal WCAG certification, complete social archives, real phone answer, owner acceptance or actual payments. GitHub Pages remains disabled; candidate canonical URLs need final launch configuration.

## Experience refinement — 15 November 2026
Kept the approved identity and verified business facts. Added locally hosted DM Sans/Fraunces Latin WOFF2 fonts with SIL OFL licenses from the official Google Fonts repository, richer original material illustrations, more intentional typography, and clearer interactions. No Google font/CDN requests occur at runtime. The web app still uses vanilla HTML/CSS/JavaScript with no runtime packages. Fonts total about 130 KB per site. No source photographs or generated paid imagery used.
## Final polish — 15 November 2026
Scroll-reveal section entrances (IntersectionObserver, reduced-motion safe), pointer parallax on the hero visual (fine-pointer only), Daisy shortlist-count pop feedback, and added structured data: contactPoint, hasOfferCatalog (barbers) and FAQPage schema, plus og:locale/og:site_name/twitter parity and sentence-case ribbon copy. All zero-dependency, still no pricing or unverified claims. Verified one h1, strict script policy, no overflow at 375/768/1440/1920, and keyboard/touch flows.

## 16 November 2026 — Vasari × Jiro visit collection
Applied Henry’s two supplied prompts as a scoped, additive vanilla HTML/CSS/JS section after existing content. Physical perspective covers, chapter controls, masked dialog reveal and sticky illustrated/photo column beside four numbered cards. Existing forms and content retained. Original licensed local fonts retained; no fictional film assets, PestGuard copy, invented claims, external font calls or React dependencies. Native dialog manages focus and Escape; normal anchor destinations work without JS; reduced motion disables animation. Responsive flow replaces the fixed scaled artboard to preserve readable type and zoom.
Unslop by Damir Sokolovsky (https://heydamir.design/unslop), CC BY 4.0, guided restraint and material hierarchy.
Reference: https://jiro.build/ and user-provided pasted-text.txt / pasted-text-2.txt.

Verified 16 November: structural validation, single h1, unique IDs, resolved anchors and assets, JavaScript/JSON-LD parsing. Browser tests: desktop 1920px and mobile 375px; chapter selection, arrow keys, native dialog open, Escape with focus restoration, action destinations, no document or dialog overflow; reduced-motion transition duration zero. Daisy truncated markup discovered and restored from ee23393, preserving all 13 photographs. No production payments, owner confirmation or formal accessibility audit performed.

## 16 November 2026 — integrated whole-page refinement
Henry requested improvement of all four active sites and supplied three coffee photographs. Moved the reference collection immediately after each hero, added Explore navigation, reconciled colour/type hierarchy and reduced competing gradients and glow. Daisy: distinct photographic covers, compact gallery with optional full browsing. Honeybee: supplied coffee hero/editorial photography, illustrated-image caveats and a warm cream/green palette. Graham: shop-inspired pale blue/black/gold; Best Cut: acid-yellow/forest-green with bold sans headline. Shared gallery viewer includes native dialog, arrows, Escape and focus restoration. Existing forms, source-backed contacts and noindex status preserved. No change to Imperial or public hosting.

### Henry’s correction: premium, remove tacky designs
Supersedes the decorative direction above. Removed active 3D shelf/visit collection, hero rack, clip-art hero scenes, neon palette, gradient text, glows and decorative reveal/parallax/pop effects. Chose editorial photography for Daisy/Honeybee and restrained typographic shop identity panels for the barbers; kept shortlist, filters, request forms and direct contact routes. Source modules for the earlier shelf were removed in the 16 November dead-file cleanup below.

Final checks: 16 November 2026. No horizontal overflow at 375, 768 and 1440px. Mobile menu opens and closes on Escape. Gallery expands to 13 images; native image dialog supports arrows and Escape with focus restoration. Daisy prepares a complete unsent enquiry email. Honeybee rejects Tuesday, accepts Wednesday and prepares an unsent email. Both barber service selections populate the note and prepare a complete unsent call summary. Local image dimensions reconciled to original JPEG headers to reserve layout space. Hero fonts report loaded; decorative shelves/racks/parallax absent. No formal Lighthouse/WCAG or Safari/Firefox audit. Supplied coffee photos kept as originals after Windows blocked the preparation PS1; total photos are approximately 9.4 MB, with only the 0.54 MB hero fetched eagerly.

## Premium refinement — 16 November 2026
Preserved approved identity and section order, following Unslop by Damir Sokolovsky (CC BY 4.0). Improved service-row hierarchy, selected-service feedback, form grouping, mobile spacing, safe-area clearance, FAQ targets, focus visibility and outside-click navigation dismissal. Daisy enquiry wording describes the actual unsent handoff. Local JPEG responsive derivatives preserve original assets, native lazy loading remains enabled, and gallery enlargement uses the larger derivative. No new business claims or paid services. See QA-2026-11-16.md for actual checks.

## Background-led direction — 16 November 2026
Henry requested photographs as backgrounds. Daisy and Honeybee now use the existing responsive images as full-bleed hero backdrops, with dark readability scrims and an honest illustrative-photo caption. The image remains a native responsive img behind the content rather than a CSS download so source selection and priority are preserved. Barbers have no saved shop photography: their former boxed wordmarks now form oversized decorative backgrounds across the hero, retaining their identities without implying stock photos are their premises. No new photography, factual claims, dependencies or motion.

## Dead-motion removal — 16 November 2026
The earlier "final polish" scroll-reveal, parallax and shortlist-pop rules in site.css were never activated by any loaded script (no `js-reveal`/`is-in` classes are set). Removed those rules and the matching `data-reveal` attributes, plus inert card-rack logic copied from another site in direction.js. This completes the decorative-motion removal above rather than changing the visual design. Also preloaded Fraunces, used the business name in the web app manifest, made the once-a-minute visit-status announcement live to assistive tech, and replaced a hard-coded 2026 date in the weekday lookup with a direct array. No layout, content, flow or launch-setting change.

## Second cleanup — 16 November 2026
Removed code for features this page cannot use: Best Cut (`studio`) opening-hour variants in app.js and experience.js, and the gallery/dialog module in refinement.js. The nav section highlight, the only refinement.js behaviour that ran here, is untouched. Listed hours and visit-note validation are unchanged.

## Third cleanup — 16 November 2026
experience.js now contains only service selection, the visit-status clock and the copy fallback; card-rack and booking-form code for absent elements was removed along with the two `SiteUX` helpers only those paths used. The two HairSalon JSON-LD nodes were merged into one (`hasOfferCatalog` moved into the business node) and an empty `sameAs` removed. No business facts, offers or visual design changed.

## Shared London clock — 16 November 2026
Replaced the locale-string parsing used for "now in London" with `Intl.DateTimeFormat` parts, exposed one `SiteUX.iso()` for both scripts and loaded experience.js first so app.js can use it. Date limits refresh on input focus and the 120-day ceiling is recomputed at submit, avoiding stale limits on a long-open tab. No layout or business-rule change.

## Radiogroup for hero services — 16 November 2026
The hero service choices now use radiogroup/radio semantics with roving tabindex and arrow-key selection instead of four independent toggle buttons. Visual selected states were re-verified in the browser after updating the `aria-checked` selectors in site.css, refinement.css and hero-background.css. No change to form values, copy or business facts.

## Hint and live feedback — 16 November 2026
The optional-time hint is now exposed to assistive tech through `aria-describedby`, and the service description announces selection changes. Nothing about the note text, business facts or layout changed.

## Not-found page — 16 November 2026
The 404 fallback shares the live stylesheet, strict script policy and pre-launch indexing block, with a clear route home and the confirmed shop number. No new business claims or visual redesign.

## CSS prune — 16 November 2026
Rules whose selectors referenced classes absent from both the HTML and the loaded JavaScript were dropped from the four loaded stylesheets, about 14 KB. Some inert grouped selectors remain because their class names appear in code or shared groups; the claim is a reduction, not a complete purge. Before/after computed-style fingerprints of all 134 elements were identical, so the visible design was unchanged.

## Clipboard fallback focus — 16 November 2026
When the modern clipboard API is unavailable, the temporary textarea used by the copy fallback no longer strands keyboard focus on `<body>`; the invoking control regains focus. Verified by forcing the clipboard API to reject in the browser.

## Nav highlight made verifiable — 16 November 2026
The observer now calls a named `SiteUX.navHighlight` function, so the setting and clearing logic can be checked without relying on IntersectionObserver delivery, which this browser does not provide. Verified in the browser for visit, services, no target and re-selection.

## Parallel audit sweep — 16 November 2026
A four-audit sweep improved keyboard access (menu focus, distinct link names, associated validation errors, copy status outside the live region), correctness (`MediaQueryList` fallback, full entry tracking in the section observer, initial service state, metadata/JSON-LD text parity) and details (favicon, manifest colours, 404 tokens, a single error red, no inert font axis, continuous h1 sizing at 800px). Failed clipboard copy now selects the note. The security audit found no weakness. All changes were verified in the browser and by a 134-element computed-style comparison with one intended difference.

## Browser verification — 17 November 2026
Lighthouse: accessibility 1.0, best practices 1.0, SEO 1.0, no failures. Real IntersectionObserver callbacks verified the nav highlight on `#visit`, `#services` and back to the hero. Service-link names include the visible text for axe parity. A ≤360px rule stops the form column overflowing a 215px viewport.
