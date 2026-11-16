// Dependency-free checks for the static site's observable contract.
// Run with: node tests/structure.test.js
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const html = read('index.html');
let passed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log('ok - ' + name); }
  catch (e) { console.error('not ok - ' + name + '\n  ' + e.message); process.exitCode = 1; }
}

check('single h1 and unique ids', () => {
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), []);
});

check('all local asset references resolve', () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(u => !/^(https?:|tel:|data:|mailto:)/.test(u));
  const missing = refs.filter(u => !fs.existsSync(path.join(root, u.split('?')[0])));
  assert.deepEqual(missing, []);
});

check('css url() references resolve', () => {
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
  const css = sheets.map(read).join('\n');
  const urls = [...css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)].map(m => m[1])
    .filter(u => !/^(data:|https?:)/.test(u));
  assert.deepEqual(urls.filter(u => !fs.existsSync(path.join(root, u))), []);
});

check('structured data parses and keeps the offer list', () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1]));
  assert.deepEqual(blocks.map(b => b['@type']).sort(), ['ContactPoint', 'FAQPage', 'HairSalon']);
  const salon = blocks.find(b => b['@type'] === 'HairSalon');
  assert.equal(salon.hasOfferCatalog.itemListElement.length, 4);
  assert.equal(salon.openingHoursSpecification.length, 2);
});

check('strict self-only content security policy', () => {
  const csp = (html.match(/content="(default-src[^"]+)"/) || [])[1] || '';
  for (const directive of ["default-src 'self'", "script-src 'self'", "style-src 'self'", "form-action 'none'", "object-src 'none'"]) {
    assert.ok(csp.includes(directive), 'missing ' + directive);
  }
});

check('only local scripts load, experience before app', () => {
  const scripts = [...html.matchAll(/<script src="([^"]+)" defer>/g)].map(m => m[1]);
  assert.deepEqual(scripts, ['experience.js', 'app.js', 'direction.js', 'refinement.js']);
  assert.ok(scripts.every(s => !/^https?:/.test(s)));
});

check('hero services expose one radiogroup with a single checked option', () => {
  assert.ok(html.includes('role="radiogroup"'));
  const choices = [...html.matchAll(/data-hero-service="([^"]+)" aria-checked="(true|false)" tabindex="(-?\d)"/g)];
  assert.equal(choices.length, 4);
  assert.equal(choices.filter(c => c[2] === 'true').length, 1);
  assert.equal(choices.filter(c => c[3] === '0').length, 1);
});

check('form fields are labelled and the time hint is associated', () => {
  const labels = [...html.matchAll(/<label for="([^"]+)"/g)].map(m => m[1]);
  for (const field of ['name', 'service', 'date', 'preferred-time', 'notes']) {
    assert.ok(labels.includes(field), 'no label for ' + field);
  }
  assert.ok(html.includes('aria-describedby="time-hint"') && html.includes('id="time-hint"'));
});

check('external links open safely', () => {
  const blank = [...html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)].map(m => m[0]);
  assert.ok(blank.length > 0);
  assert.deepEqual(blank.filter(a => !/noopener/.test(a) || !/noreferrer/.test(a)), []);
});

check('web app manifest uses the business name', () => {
  assert.equal(JSON.parse(read('site.webmanifest')).name, "Graham's Gents Barbers");
});

check('honeypot field stays hidden from people and assistive tech', () => {
  const honeypot = html.match(/<input id="website"[^>]*>/)[0];
  const wrapper = html.match(/<div class="hp"[^>]*>/)[0];
  assert.ok(/tabindex="-1"/.test(honeypot));
  assert.ok(/aria-hidden="true"/.test(wrapper));
  assert.ok(/<div class="hp"[^>]*>[\s\S]*?id="website"/.test(html));
});

check('no third-party runtime assets or inline handlers', () => {
  const runtime = [
    ...[...html.matchAll(/<script[^>]+src="(https?:[^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/<link[^>]+rel="(?:stylesheet|preload|prefetch|modulepreload)"[^>]+href="(https?:[^"]+)"/g)].map(m => m[1])
  ];
  assert.deepEqual(runtime, []);
  const inline = [...html.matchAll(/\s+on(?:click|error|load|submit|change|input|focus|mouseover)\s*=/gi)];
  assert.deepEqual(inline, []);
});

check('nav highlight has a callable clear path', () => {
  const exp = read('experience.js'), ref = read('refinement.js');
  assert.ok(/navHighlight\(visibleId\)/.test(exp));
  assert.ok(/removeAttribute\('aria-current'\)/.test(exp));
  assert.ok(/SiteUX\.navHighlight\(visible\?visible\.target\.id:null\)/.test(ref));
});

check('responsive and reduced-motion breakpoints are present', () => {
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
  const css = sheets.map(read).join('\n');
  for (const bp of ['@media(max-width:800px)', '@media(max-width:440px)', '@media(prefers-reduced-motion:reduce)']) {
    assert.ok(css.includes(bp), 'missing ' + bp);
  }
  assert.ok(/\.mobile\s*\{/.test(css));
});

check('theme colour matches the hero background', () => {
  const theme = (html.match(/name="theme-color" content="([^"]+)"/) || [])[1];
  const hero = (read('hero-background.css').match(/\.direction-hero\.type-grahams\{background:(#[0-9a-f]{6})/i) || [])[1];
  assert.ok(theme && hero);
  assert.equal(theme.toLowerCase(), hero.toLowerCase());
});

check('every static class keeps a CSS rule', () => {
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1]);
  const css = sheets.map(read).join('\n');
  const classes = [...new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/)).filter(Boolean))];
  // 'heritage' is a body hook with no styling by design.
  const missing = classes.filter(c => c !== 'heritage' && !new RegExp('\\.' + c + '\\b').test(css));
  assert.deepEqual(missing, []);
});

check('social image and sitemap match the declared URL', () => {
  const png = fs.readFileSync(path.join(root, 'og-image.png'));
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const sitemap = read('sitemap.xml');
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  assert.ok(canonical);
  assert.ok(sitemap.includes('<loc>' + canonical + '</loc>'));
});

check('not-found page keeps the site style and a safe fallback', () => {
  const notFound = read('404.html');
  assert.match(notFound, /<h1>Page not found<\/h1>/);
  assert.ok(notFound.includes('href="./"'));
  assert.ok(notFound.includes('href="site.css"'));
  assert.ok(notFound.includes('name="robots" content="noindex, nofollow"'));
  assert.ok(notFound.includes("script-src 'self'"));
  assert.ok(notFound.includes('tel:+442920763442'));
});

check('structured data matches visible hours and service names', () => {
  const salon = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1])).find(b => b['@type'] === 'HairSalon');
  const specs = salon.openingHoursSpecification;
  assert.ok(specs.some(x => x.opens === '09:00' && x.closes === '17:00'));
  assert.ok(specs.some(x => x.opens === '09:00' && x.closes === '13:00'));
  assert.ok(html.includes('Monday–Friday 09:00–17:00 · Saturday 09:00–13:00'));
  const names = salon.hasOfferCatalog.itemListElement.map(i => i.itemOffered.name);
  assert.equal(names.length, 4);
  for (const n of names) assert.ok(html.includes(n), 'service name absent from page: ' + n);
});

check('service links have distinct accessible names', () => {
  const labels = [...html.matchAll(/data-service="[^"]+" aria-label="([^"]+)"/g)].map(m => m[1]);
  assert.equal(labels.length, 4);
  assert.equal(new Set(labels).size, 4);
  assert.equal([...html.matchAll(/<a href="#plan"[^>]*>Ask about this<\/a>/g)].length, 4);
});

check('copy feedback is outside the result live region', () => {
  assert.ok(html.includes('id="result" class="result" role="region"'));
  const app = read('app.js');
  assert.ok(app.includes("copyState.setAttribute('aria-live','polite')"));
  assert.ok(app.includes("range.selectNodeContents(pre)"));
});

check('validation error is stable and associated with invalid fields', () => {
  assert.ok(html.includes('<p id="visit-error" class="inline-error" role="alert" tabindex="-1"></p>'));
  const app = read('app.js');
  assert.ok(app.includes("field?.setAttribute('aria-describedby','visit-error')"));
  assert.ok(app.includes("error.textContent=''"));
  assert.ok(read('site.css').includes('.inline-error:empty{display:none}'));
});

check('metadata and icon use the final brand palette', () => {
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  assert.equal((html.match(/property="og:title" content="([^"]+)"/) || [])[1], title);
  assert.equal((html.match(/name="twitter:title" content="([^"]+)"/) || [])[1], title);
  const manifest = JSON.parse(read('site.webmanifest'));
  assert.equal(manifest.theme_color, (html.match(/name="theme-color" content="([^"]+)"/) || [])[1]);
  const icon = read('favicon.svg');
  assert.ok(icon.includes('#1d292c') && icon.includes('#d6c49c'));
});

check('observer tracks all observed sections, not just changed entries', () => {
  const ref = read('refinement.js');
  assert.ok(ref.includes('const seen=new Map()'));
  assert.ok(ref.includes('batch.forEach(e=>seen.set(e.target.id,e))'));
  assert.ok(ref.includes('[...seen.values()].filter(e=>e.isIntersecting)'));
});

check('pre-launch indexing block is still in place', () => {
  assert.match(read('robots.txt'), /Disallow:\s*\//);
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
});

check('removed legacy modules are not referenced', () => {
  const sources = [html, ...['site.css', 'refinement.css', 'finishing.css', 'hero-background.css',
    'app.js', 'direction.js', 'experience.js', 'refinement.js'].map(read)].join('\n');
  for (const dead of ['style.css', 'direction.css', 'visit-collection.css', 'visit-collection.js']) {
    assert.ok(!sources.includes(dead), 'stale reference to ' + dead);
  }
});

if (!process.exitCode) console.log('\n' + passed + ' checks passed');
