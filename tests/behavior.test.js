// Dependency-free runtime harness for the visit-note form.
// Run with: node --test tests/behavior.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
let activeElement = null;

// A deliberately small DOM: only the APIs app.js actually uses.
class El {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.attrs = {};
    this.listeners = {};
    this.value = '';
    this.textContent = '';
    this.hidden = false;
    this.className = '';
    this.tabIndex = 0;
    this.min = '';
    this.max = '';
    this.required = false;
  }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatchEvent(event) {
    event.target ||= this;
    for (const fn of this.listeners[event.type] || []) fn.call(this, event);
    return true;
  }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  getAttribute(key) { return key in this.attrs ? this.attrs[key] : null; }
  removeAttribute(key) { delete this.attrs[key]; }
  focus() { activeElement = this; }
  setCustomValidity() {}
  reportValidity() { return !this.required || this.value.trim().length > 0; }
  replaceChildren(...nodes) { this.children = nodes; }
  append(...nodes) { this.children.push(...nodes); }
  querySelectorAll(selector) {
    if (selector === '[aria-invalid]') return this.children.filter(c => c.getAttribute('aria-invalid') !== null);
    return [];
  }
}

const fields = {
  '#name': new El('input'), '#service': new El('select'), '#date': new El('input'),
  '#preferred-time': new El('input'), '#notes': new El('textarea'), '#website': new El('input')
};
fields['#service'].value = 'Men’s haircut';
fields['#name'].required = true;
fields['#date'].required = true;

function build() {
  for (const field of Object.values(fields)) {
    field.value = field === fields['#service'] ? 'Men’s haircut' : '';
    field.textContent = '';
    field.attrs = {};
  }
  const form = new El('form');
  const result = new El('div');
  const error = new El('p');
  result.hidden = true;
  form.children = Object.values(fields);
  const document = {
    activeElement: null,
    querySelector(selector) {
      if (selector === '#visit-form') return form;
      if (selector === '#result') return result;
      if (selector === '#visit-error') return error;
      return fields[selector] || null;
    },
    createElement(tag) { return new El(tag); },
    createRange() { return { selectNodeContents() {} }; }
  };
  const context = {
    document,
    window: { getSelection: () => ({ removeAllRanges() {}, addRange() {} }) },
    navigator: { clipboard: { writeText: async () => true } },
    Event: class { constructor(type, options = {}) { this.type = type; Object.assign(this, options); } },
    SiteUX: {
      // Fixed clock: Tuesday 17 November 2026, 10:00 London time.
      london: () => new Date(2026, 10, 17, 10, 0),
      iso: d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'),
      copy: async () => true
    },
    setInterval() {}, console
  };
  vm.runInNewContext(source, context);
  return { form, result, error };
}

// Event objects only need a type and a target; app.js reads those two fields.
class TestEvent {
  constructor(type, options = {}) { this.type = type; Object.assign(this, options); }
  preventDefault() { this.defaultPrevented = true; }
}

function run(form) { form.dispatchEvent(new TestEvent('submit')); }

function noteText(result) {
  const pre = result.children.find(c => c.tagName === 'PRE');
  return pre ? pre.textContent : '';
}

test('date limits are set from the shared London clock', () => {
  const { form } = build();
  assert.equal(fields['#date'].min, '2026-11-17');
  assert.equal(fields['#date'].max, '2027-03-17');
});

test('honeypot stops the form silently', () => {
  const { form, result, error } = build();
  fields['#website'].value = 'bot';
  fields['#name'].value = 'Test';
  fields['#date'].value = '2026-11-18';
  run(form);
  assert.equal(result.hidden, true);
  assert.equal(error.textContent, '');
  fields['#website'].value = '';
});

test('Sunday is rejected and a weekday builds a note', () => {
  const { form, result, error } = build();
  fields['#name'].value = 'Test Visitor';
  fields['#date'].value = '2026-11-22';
  run(form);
  assert.match(error.textContent, /Sunday/);
  assert.equal(fields['#date'].getAttribute('aria-invalid'), 'true');
  assert.equal(fields['#date'].getAttribute('aria-describedby'), 'visit-error');

  fields['#date'].value = '2026-11-18';
  form.dispatchEvent(new TestEvent('input'));
  run(form);
  assert.equal(result.hidden, false);
  const note = noteText(result);
  assert.match(note, /Name: Test Visitor/);
  assert.match(note, /Wednesday, 18 November 2026/);
  assert.match(note, /No appointment has been reserved/);
  assert.equal(result.children.some(c => c.tagName === 'PRE' && c.tabIndex === 0), true);
});

test('out-of-hours and past times are rejected; valid times accepted', () => {
  const { form, result, error } = build();
  fields['#name'].value = 'Test Visitor';
  fields['#date'].value = '2026-11-21'; // Saturday, 09:00-13:00
  fields['#preferred-time'].value = '13:30';
  run(form);
  assert.match(error.textContent, /opening hours/);
  fields['#preferred-time'].value = '11:30';
  run(form);
  assert.equal(result.hidden, false);
  assert.match(noteText(result), /Preferred time: 11:30/);

  fields['#date'].value = '2026-11-17'; // today, clock 10:00
  fields['#preferred-time'].value = '09:30';
  run(form);
  assert.match(error.textContent, /time has passed/);
});

test('editing a field clears stale output and error state', () => {
  const { form, result, error } = build();
  fields['#name'].value = 'Test Visitor';
  fields['#date'].value = '2026-11-22';
  run(form);
  assert.match(error.textContent, /Sunday/);
  fields['#name'].value = 'Another';
  form.dispatchEvent(new TestEvent('input'));
  assert.equal(error.textContent, '');
  assert.equal(fields['#date'].getAttribute('aria-invalid'), null);
  assert.equal(result.hidden, true);
  assert.equal(result.children.length, 0);
});
