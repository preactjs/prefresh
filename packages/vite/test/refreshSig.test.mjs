/**
 * Unit tests for the $RefreshSig$ factory injected by @prefresh/vite.
 *
 * The factory is defined inline in the prelude string. These tests replicate
 * it verbatim and drive it against a mock __PREFRESH__.sign so we can assert
 * on registration order and status values without spinning up Vite.
 */

import assert from 'node:assert/strict';
import test from 'node:test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a mock __PREFRESH__.sign implementation that records every call and
 * mirrors the real sign() state machine from @prefresh/core.
 */
function makeMockSign() {
  const signaturesForType = new Map();
  const calls = [];

  function sign(type, key, forceReset, getCustomHooks, status) {
    calls.push({ type, key, status });
    if (!type) return;

    if (status === 'begin') {
      if (!signaturesForType.has(type)) {
        signaturesForType.set(type, {
          type,
          key,
          forceReset,
          getCustomHooks: getCustomHooks || (() => []),
          fullKey: null,
        });
      }
      return 'needsHooks';
    } else if (status === 'needsHooks') {
      const sig = signaturesForType.get(type);
      if (sig) sig.fullKey = sig.key; // simplified computeKey
    }
  }

  return { sign, calls, signaturesForType };
}

/**
 * Builds the $RefreshSig$ factory exactly as the vite plugin injects it,
 * wired to a provided sign mock.
 */
function makeFactory(sign) {
  return function $RefreshSig$() {
    let savedType;
    let hasCustomHooks = false;
    let didCollectHooks = false;
    return (type, key, forceReset, getCustomHooks) => {
      if (typeof key === 'string') {
        if (!savedType) {
          savedType = type;
          hasCustomHooks = typeof getCustomHooks === 'function';
        }
        if (type != null) {
          sign(type, key, forceReset, getCustomHooks, 'begin');
        }
      } else {
        if (!didCollectHooks && hasCustomHooks) {
          didCollectHooks = true;
          sign(savedType, undefined, undefined, undefined, 'needsHooks');
        }
      }
      return type;
    };
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('plain component: registers on keyed call and collects hooks on body call', () => {
  const { sign, calls, signaturesForType } = makeMockSign();
  const $RefreshSig$ = makeFactory(sign);

  const getCustomHooks = () => [];
  const _s = $RefreshSig$();
  const Comp = function MyComponent() {};
  const key = 'abc123=';

  // keyed call — emitted at module evaluation
  _s(Comp, key, false, getCustomHooks);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].type, Comp);
  assert.equal(calls[0].status, 'begin');
  assert.ok(signaturesForType.has(Comp));

  // body call — emitted inside the component function, runs on first render
  _s();

  assert.equal(calls.length, 2);
  assert.equal(calls[1].type, Comp);
  assert.equal(calls[1].status, 'needsHooks');

  // subsequent renders must not re-register
  _s();
  assert.equal(calls.length, 2, 'body call is a one-shot');
});

test('plain component without custom hooks: body call is skipped', () => {
  const { sign, calls } = makeMockSign();
  const $RefreshSig$ = makeFactory(sign);

  const _s = $RefreshSig$();
  const Comp = function MyComponent() {};

  _s(Comp, 'key='); // no getCustomHooks argument

  _s(); // body call — should be a no-op since hasCustomHooks is false

  assert.equal(calls.length, 1, 'only the begin call, no needsHooks');
});

test('HOC chain (memo-wrapped): both inner and outer types are registered', () => {
  const { sign, calls, signaturesForType } = makeMockSign();
  const $RefreshSig$ = makeFactory(sign);

  const getCustomHooks = () => [];
  const _s = $RefreshSig$();

  const innerFn = function Button() {};
  const memoResult = { type: innerFn, $$typeof: Symbol.for('preact.memo') };
  const key = 'WQ9WH5eCVGcEPdUJDepp+VlX1/c=';

  // Mirrors: const Button = _s(memo(_c = _s(innerFn, key)), key)
  // Evaluation is inside-out, so innerFn is registered first.
  _s(innerFn, key, false, getCustomHooks);
  _s(memoResult, key);

  assert.equal(calls.length, 2);
  assert.equal(calls[0].type, innerFn);
  assert.equal(calls[0].status, 'begin');
  assert.equal(calls[1].type, memoResult);
  assert.equal(calls[1].status, 'begin');

  assert.ok(signaturesForType.has(innerFn), 'inner function registered');
  assert.ok(signaturesForType.has(memoResult), 'memo wrapper registered');

  // savedType is the innermost (innerFn) — body call uses it
  _s();
  assert.equal(calls.length, 3);
  assert.equal(calls[2].type, innerFn);
  assert.equal(calls[2].status, 'needsHooks');
});

test('HOC chain: innermost registration is not overwritten by outer call', () => {
  const { sign, signaturesForType } = makeMockSign();
  const $RefreshSig$ = makeFactory(sign);

  const getCustomHooks = () => ['useFoo'];
  const _s = $RefreshSig$();

  const innerFn = function Card() {};
  const wrapper = { type: innerFn };
  const key = 'somekey=';

  _s(innerFn, key, false, getCustomHooks); // inner: has getCustomHooks
  _s(wrapper, key);                         // outer: no getCustomHooks

  // inner registration must preserve its getCustomHooks
  const sig = signaturesForType.get(innerFn);
  assert.equal(sig.getCustomHooks, getCustomHooks);
});

test('multiple renders: body call only triggers needsHooks once', () => {
  const { sign, calls } = makeMockSign();
  const $RefreshSig$ = makeFactory(sign);

  const getCustomHooks = () => [];
  const _s = $RefreshSig$();
  const Comp = function Foo() {};

  _s(Comp, 'k=', false, getCustomHooks);

  _s(); // render 1
  _s(); // render 2
  _s(); // render 3

  const needsHooksCalls = calls.filter(c => c.status === 'needsHooks');
  assert.equal(needsHooksCalls.length, 1);
});
