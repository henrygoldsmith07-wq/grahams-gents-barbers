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
