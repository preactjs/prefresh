import assert from 'node:assert/strict';
import test from 'node:test';
import { rolldown } from 'rolldown';

import prefreshPlugin from '../src/index.js';

test('transforms named createContext imports', async () => {
  const code = await transform(
    `import { createContext } from 'preact';\n\nexport function aaa() {\n  const context = createContext();\n}\n`
  );

  assert.equal(
    stripRolldownRuntime(code),
    `import { createContext } from "preact";\n//#region virtual:entry.js\nfunction aaa() {\n\tcreateContext[\`1e87a657330148b0$context1\`] || (createContext[\`1e87a657330148b0$context1\`] = createContext());\n}\n//#endregion\nexport { aaa };\n`
  );
});

test('transforms default and namespace imports', async () => {
  const code = await transform(
    `import pp from 'preact';\nimport * as ns from 'preact';\n\nexport function aaa(a, b) {\n  pp.createContext();\n  return ns["createContext"]();\n}\n`
  );

  assert.equal(
    stripRolldownRuntime(code),
    `import * as ns from "preact";\nimport pp from "preact";\n//#region virtual:entry.js\nfunction aaa(a, b) {\n\tpp.createContext[\`1e87a657330148b01_\${a}\${b}\`] || (pp.createContext[\`1e87a657330148b01_\${a}\${b}\`] = pp.createContext());\n\treturn ns["createContext"][\`1e87a657330148b02_\${a}\${b}\`] || (ns["createContext"][\`1e87a657330148b02_\${a}\${b}\`] = ns["createContext"]());\n}\n//#endregion\nexport { aaa };\n`
  );
});

test('preserves local shadowed bindings', async () => {
  const code = await transform(
    `import { createContext } from 'preact';\n\nexport function aaa() {\n  function createContext() {}\n  const context = createContext();\n}\n\nexport function bbb() {\n  const context = createContext();\n}\n`
  );

  assert.equal(
    stripRolldownRuntime(code),
    `import { createContext } from "preact";\n//#region virtual:entry.js\nfunction aaa() {\n\tfunction createContext() {}\n\tcreateContext();\n}\nfunction bbb() {\n\tcreateContext[\`1e87a657330148b0$context1\`] || (createContext[\`1e87a657330148b0$context1\`] = createContext());\n}\n//#endregion\nexport { aaa, bbb };\n`
  );
});

test('memoizes createContext values with defaults', async () => {
  const code = await transform(
    `import { createContext } from 'preact';\n\nexport function aaa(a, b) {\n  const context = createContext({});\n}\n`
  );

  assert.equal(
    stripRolldownRuntime(code),
    `import { createContext } from "preact";\n//#region virtual:entry.js\nfunction aaa(a, b) {\n\tObject.assign(createContext[\`1e87a657330148b0$context1_\${a}\${b}\`] || (createContext[\`1e87a657330148b0$context1_\${a}\${b}\`] = createContext({})), { __: {} });\n}\n//#endregion\nexport { aaa };\n`
  );
});

test('supports custom library configuration', async () => {
  const code = await transform(
    `import { createContext } from '@custom/preact';\n\nexport function aaa() {\n  const context = createContext();\n}\n`,
    { library: ['@custom/preact'] }
  );

  assert.equal(
    stripRolldownRuntime(code),
    `import { createContext } from "@custom/preact";\n//#region virtual:entry.js\nfunction aaa() {\n\tcreateContext[\`1e87a657330148b0$context1\`] || (createContext[\`1e87a657330148b0$context1\`] = createContext());\n}\n//#endregion\nexport { aaa };\n`
  );
});

test('matches the full prefresh vite extension set', () => {
  const idFilter = prefreshPlugin({ enabled: true }).transform.filter.id;
  const supported = [
    'virtual:entry.js',
    'virtual:entry.jsx',
    'virtual:entry.ts',
    'virtual:entry.tsx',
    'virtual:entry.mjs',
    'virtual:entry.mjsx',
    'virtual:entry.mts',
    'virtual:entry.mtsx',
    'virtual:entry.cjs',
    'virtual:entry.cjsx',
    'virtual:entry.cts',
    'virtual:entry.ctsx',
  ];

  for (const filename of supported) {
    assert.equal(idFilter.test(filename), true, filename);
  }

  assert.equal(idFilter.test('virtual:entry.json'), false);
});

test('supports mjs and mtsx transforms', async () => {
  const filenames = [
    'virtual:entry.mjs',
    'virtual:entry.mts',
    'virtual:entry.mjsx',
    'virtual:entry.mtsx',
  ];

  for (const filename of filenames) {
    const code = await transform(
      `import { createContext } from 'preact';\n\nexport const context = createContext();\n`,
      {},
      filename
    );

    assert.match(
      stripRolldownRuntime(code),
      /createContext\[`[0-9a-f]{16}\$context1`\] \|\| \(createContext\[`[0-9a-f]{16}\$context1`\] = createContext\(\)\);/
    );
  }
});

async function transform(code, options = {}, filename = 'virtual:entry.js') {
  const ext = filename.match(/\.(c|m)?(t|j)sx?$/)?.[0] || '.js';
  const virtualEntry = `virtual:entry${ext}`;

  const bundle = await rolldown({
    input: virtualEntry,
    plugins: [
      {
        name: 'virtual',
        resolveId(id) {
          if (id === virtualEntry) return id;
          return { id, external: true };
        },
        load(id) {
          if (id === virtualEntry) return code;
        },
      },
      prefreshPlugin({ ...options, enabled: true }),
    ],
  });

  const { output } = await bundle.generate({ format: 'esm' });
  return output[0].code;
}

function stripRolldownRuntime(code) {
  return code.replace(
    /\/\/#region \\0rolldown\/runtime\.js[\s\S]*?\/\/#endregion\n*/g,
    ''
  );
}
