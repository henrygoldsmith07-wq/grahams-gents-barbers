// Dependency-free runtime harness for the service selection and radiogroup keys.
// Run with: node --test tests/interaction.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'experience.js'), 'utf8');
let focused = null;

class Emitter {
  constructor() { this.listeners = {}; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type, event = {}) {
    event.target ||= this;
    for (const fn of this.listeners[type] || []) fn.call(this, event);
  }
  dispatchEvent(event) { this.fire(event.type, event); }
}

class RadioButton extends Emitter {
  constructor(name) {
    super();
    this.dataset = { heroService: name };
    this.attrs = { 'aria-checked': 'false' };
    this.tabIndex = -1;
  }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  getAttribute(key) { return key in this.attrs ? this.attrs[key] : null; }
  click() { this.fire('click'); }
  focus() { focused = this; }
}

function build() {
  focused = null;
  const names = ['Men’s haircut', 'Beard trim', 'Head shave', 'Hot towel shave'];
  const buttons = names.map(n => new RadioButton(n));
  const select = new Emitter();
  select.value = names[0];
  const copy = { textContent: '' };
  const status = { textContent: '' };
  const listItems = names.map(n => {
    const link = { dataset: { service: n } };
    return { querySelector: () => link, classList: { toggle() {} } };
  });
  const group = new Emitter();
  group.querySelectorAll = () => buttons;
  const document = {
    activeElement: null,
    querySelector(selector) {
      if (selector === '#service') return select;
      if (selector === '#service-copy') return copy;
      if (selector === '#visit-status') return status;
      if (selector === '.service-choice[role="radiogroup"]') return group;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-hero-service]') return buttons;
      if (selector === '.services li') return listItems;
      if (selector === '[data-service]') return [];
      if (selector.startsWith('#main-nav')) return [];
      return [];
    },
    addEventListener() {}
  };
  const context = {
    document, navigator: {}, console,
    Event: class { constructor(type, options = {}) { this.type = type; Object.assign(this, options); } },
    setInterval() {}, matchMedia: () => ({ addEventListener() {} })
  };
  // In a browser, window is the global object, so window.SiteUX is a bare global.
  context.window = context;
  vm.runInNewContext(source, context);
  return { buttons, select, copy, status, group, serviceLinks: listItems.map(li => li.querySelector()) };
}

const state = bs => bs.map(b => b.getAttribute('aria-checked') + ':' + b.tabIndex).join(' ');
const key = k => ({ key: k, preventDefault() { this.prevented = true; } });

test('initial selection has one checked button and one tab stop', () => {
  const { buttons, select, copy } = build();
  assert.equal(select.value, 'Men’s haircut');
  assert.equal(state(buttons), 'true:0 false:-1 false:-1 false:-1');
  assert.match(copy.textContent, /Men’s haircut selected/);
});

test('clicking a hero radio updates selection, select value and live copy', () => {
  const { buttons, select, copy } = build();
  buttons[2].click();
  assert.equal(select.value, 'Head shave');
  assert.equal(state(buttons), 'false:-1 false:-1 true:0 false:-1');
  assert.match(copy.textContent, /Head shave selected/);
});

test('arrow, Home and End keys move selection and focus', () => {
  const { buttons, select, group } = build();
  group.fire('keydown', key('ArrowRight'));
  assert.equal(select.value, 'Beard trim');
  assert.equal(focused, buttons[1]);
  group.fire('keydown', key('End'));
  assert.equal(select.value, 'Hot towel shave');
  assert.equal(focused, buttons[3]);
  group.fire('keydown', key('ArrowRight'));
  assert.equal(select.value, 'Men’s haircut');
  group.fire('keydown', key('ArrowLeft'));
  assert.equal(select.value, 'Hot towel shave');
  group.fire('keydown', key('Home'));
  assert.equal(select.value, 'Men’s haircut');
});

test('unrelated keys do not change the selection', () => {
  const { buttons, select, group } = build();
  group.fire('keydown', key('Enter'));
  assert.equal(select.value, 'Men’s haircut');
  assert.equal(state(buttons), 'true:0 false:-1 false:-1 false:-1');
});
