/**
 * Unit tests for the `createContext` transform in @prefresh/babel-plugin.
 *
 * The interesting part is re-entrancy: the visitor replaces a
 * `createContext(...)` call with a memoised version that calls
 * `createContext(...)` again, so it must not visit — and wrap — its own output.
 * `replaceWith()` requeues the path it replaced and Babel 8's `requeue()`
 * resets `shouldSkip`, so `path.skip()` has to happen *after* the replacement
 * (preactjs/prefresh#631).
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { transformSync } from '@babel/core';
import prefresh from '../src/index.mjs';

/**
 * Emulates Babel 8's `requeue()`, which resets `shouldSkip` before queueing.
 * Under Babel 8 this matches what traverse already does; under Babel 7 it makes
 * the #631 recursion reproducible, so these tests guard the fix on both majors.
 *
 * The patch lands on `NodePath.prototype`, which we can only reach from inside
 * a visitor, and is undone through the returned restore function.
 */
const babel8Requeue = () => {
  let restore = () => {};

  return {
    plugin: {
      visitor: {
        Program(path) {
          const proto = Object.getPrototypeOf(path);
          const original = proto.requeue;
          restore = () => {
            proto.requeue = original;
          };
          proto.requeue = function (pathToQueue = this) {
            if (pathToQueue.removed) return;
            pathToQueue.shouldSkip = false;
            return original.call(this, pathToQueue);
          };
        },
      },
    },
    restore: () => restore(),
  };
};

const transform = (source, extraPlugins = []) =>
  transformSync(source, {
    filename: '/app/min.jsx',
    configFile: false,
    babelrc: false,
    parserOpts: { plugins: ['jsx', 'typescript'] },
    plugins: [...extraPlugins, [prefresh, { skipEnvCheck: true }]],
  }).code;

const countCalls = code => code.split('createContext(').length - 1;

test('wraps a module-scope createContext exactly once', () => {
  const code = transform(
    `import { createContext } from 'preact';\nexport const Ctx = createContext(null);`
  );

  assert.match(code, /createContext\[`_\w+\$Ctx`\]/);
  assert.match(code, /Object\.assign\(/);
  assert.equal(countCalls(code), 1);
});

test('does not re-wrap its own output when the path is requeued', () => {
  const { plugin, restore } = babel8Requeue();

  try {
    const code = transform(
      `import { createContext } from 'preact';\nexport const Ctx = createContext(null);`,
      [plugin]
    );

    assert.equal(countCalls(code), 1);
  } finally {
    restore();
  }
});

test('wraps createContext without arguments exactly once', () => {
  const code = transform(
    `import { createContext } from 'preact';\nexport const Ctx = createContext();`
  );

  assert.equal(countCalls(code), 1);
  assert.doesNotMatch(code, /Object\.assign\(/);
});

for (const [name, source] of Object.entries({
  'a function body': `function make() { return createContext(null); }`,
  'an arrow body': `const make = value => createContext(value);`,
  'an object property': `export const o = { Ctx: createContext(1) };`,
  'an assignment': `let Ctx;\nCtx = createContext(1);`,
  'a TS as-expression': `export const Ctx = createContext(null as any);`,
})) {
  test(`wraps createContext in ${name} exactly once`, () => {
    const code = transform(
      `import { createContext } from 'preact';\n${source}`
    );

    assert.equal(countCalls(code), 1);
  });
}

test('gives sibling contexts distinct keys', () => {
  const code = transform(
    `import { createContext } from 'preact';\nexport const A = createContext(1);\nexport const B = createContext(2);`
  );
  const keys = code.match(/createContext\[`[^`]+`\]/g);

  assert.equal(keys.length, 4);
  assert.notEqual(keys[0], keys[2]);
});

test('keys an in-closure context by the enclosing parameters', () => {
  const code = transform(
    `import { createContext } from 'preact';\nexport const make = value => createContext(value);`
  );

  assert.match(code, /\$\{value\}/);
});

test('leaves unrelated createContext calls alone', () => {
  const code = transform(
    `import { createContext } from 'some-other-lib';\nexport const Ctx = createContext(null);`
  );

  assert.doesNotMatch(code, /Object\.assign\(/);
  assert.equal(countCalls(code), 1);
});

test('supports react and preact/compat imports', () => {
  for (const source of ['react', 'preact/compat']) {
    const code = transform(
      `import { createContext } from '${source}';\nexport const Ctx = createContext(null);`
    );

    assert.match(code, /createContext\[`_\w+\$Ctx`\]/);
    assert.equal(countCalls(code), 1);
  }
});
