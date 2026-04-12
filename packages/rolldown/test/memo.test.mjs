import assert from 'node:assert/strict';
import test from 'node:test';
import { rolldown } from 'rolldown';

import prefreshPlugin from '../src/index.js';

const MEMO_FIXTURE = `
import { memo } from "preact/compat";
import { useMemo } from "preact/hooks";

const Button = memo(({ name, className, onClick }) => {
    const classes = useMemo(() => {
        const classList = ["btn"];
        if (className) classList.push(className);
        return classList.join(" ");
    }, [className]);

    return <button name={name} className={classes} onClick={onClick}>Click</button>;
});

export default Button;
`;

test('issue #610: Oxc emits one $RefreshSig$ factory for memo-wrapped component', async () => {
  const output = await transform(MEMO_FIXTURE);

  assert.match(output, /\$RefreshSig\$/, 'should contain $RefreshSig$');
  assert.match(output, /\$RefreshReg\$/, 'should contain $RefreshReg$');

  const sigFactoryCalls = output.match(/\$RefreshSig\$\(\)/g);
  assert.equal(sigFactoryCalls.length, 1, 'exactly one factory');

  assert.match(
    output,
    /_s\(memo\(_c\s*=\s*_s\(/,
    'same _s wraps both inner function and outer memo()'
  );
});

test('issue #610: $RefreshSig$ wrapper must not crash for memo-wrapped components', async () => {
  const signaturesForType = new Map();

  function sign(type, key, forceReset, getCustomHooks, status) {
    if (type) {
      let signature = signaturesForType.get(type);
      if (status === 'begin') {
        signaturesForType.set(type, {
          type,
          key,
          forceReset,
          getCustomHooks: getCustomHooks || (() => []),
        });
        return 'needsHooks';
      } else if (status === 'needsHooks') {
        signature.fullKey = signature.key;
      }
    }
  }

  // Fixed wrapper: calls with a key always use 'begin'
  function $RefreshSig$() {
    let status = 'begin';
    let savedType;
    return (type, key, forceReset, getCustomHooks) => {
      if (!savedType) savedType = type;
      status = sign(
        type || savedType,
        key,
        forceReset,
        getCustomHooks,
        key ? 'begin' : status
      );
      return type;
    };
  }

  const _s = $RefreshSig$();
  const innerFn = function Button() {};
  const memo = (fn) => ({ type: fn, $$typeof: Symbol.for('preact.memo') });
  const key = 'WQ9WH5eCVGcEPdUJDepp+VlX1/c=';

  // _s(innerFn, key) — registers the inner function
  assert.equal(_s(innerFn, key), innerFn);
  assert.ok(signaturesForType.has(innerFn), 'innerFn registered');

  // _s(memoResult, key) — must register the memo wrapper without crashing
  const memoResult = memo(innerFn);
  assert.doesNotThrow(() => _s(memoResult, key));
  assert.ok(signaturesForType.has(memoResult), 'memo wrapper registered');
});

test('issue #610: Babel path (single _s call) still works with the fix', () => {
  const signaturesForType = new Map();

  function sign(type, key, forceReset, getCustomHooks, status) {
    if (type) {
      let signature = signaturesForType.get(type);
      if (status === 'begin') {
        signaturesForType.set(type, {
          type,
          key,
          forceReset,
          getCustomHooks: getCustomHooks || (() => []),
        });
        return 'needsHooks';
      } else if (status === 'needsHooks') {
        signature.fullKey = signature.key;
      }
    }
  }

  function $RefreshSig$() {
    let status = 'begin';
    let savedType;
    return (type, key, forceReset, getCustomHooks) => {
      if (!savedType) savedType = type;
      status = sign(
        type || savedType,
        key,
        forceReset,
        getCustomHooks,
        key ? 'begin' : status
      );
      return type;
    };
  }

  // Babel pattern: memo(_c = _s(innerFn, key))  — only innerFn gets _s
  // Then _s() in the component body during render
  const _s = $RefreshSig$();
  const innerFn = function Button() {};
  const key = 'WQ9WH5eCVGcEPdUJDepp+VlX1/c=';

  assert.equal(_s(innerFn, key), innerFn);
  assert.ok(signaturesForType.has(innerFn), 'innerFn registered');

  // Body call _s() — no key, triggers needsHooks
  assert.doesNotThrow(() => _s());
  const sig = signaturesForType.get(innerFn);
  assert.equal(sig.fullKey, key, 'fullKey computed via needsHooks');
});

async function transform(code) {
  const bundle = await rolldown({
    input: 'virtual:entry.jsx',
    plugins: [
      {
        name: 'virtual',
        resolveId(id) {
          if (id === 'virtual:entry.jsx') return id;
          return { id, external: true };
        },
        load(id) {
          if (id === 'virtual:entry.jsx') return code;
        },
      },
      prefreshPlugin({ enabled: true }),
    ],
    transform: {
      jsx: {
        runtime: 'automatic',
        importSource: 'preact',
        refresh: true,
      },
    },
  });

  const { output } = await bundle.generate({ format: 'esm' });
  return stripRolldownRuntime(output[0].code);
}

function stripRolldownRuntime(code) {
  return code.replace(
    /\/\/#region \\0rolldown\/runtime\.js[\s\S]*?\/\/#endregion\n*/g,
    ''
  );
}
