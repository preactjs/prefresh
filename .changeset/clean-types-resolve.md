---
'@prefresh/vite': patch
---

Fix type resolution under `moduleResolution: NodeNext` and Deno

The `import` condition now resolves to a real ESM entry (`src/index.mjs`) with matching ESM type declarations (`index.d.mts` using `export default`), while `require` keeps the CommonJS declarations (`index.d.ts` using `export =`). Previously the ESM entry was typed with a CJS-style `export =` declaration, which TypeScript 6 / Deno 2.8.3+ reject as a hard error.

Also inline the `FilterPattern` type instead of importing it from `@rollup/pluginutils`, whose types do not resolve under NodeNext.
