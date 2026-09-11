---
'@prefresh/babel-plugin': patch
'@prefresh/vite': patch
---

Fix `Maximum call stack size exceeded` when transforming `createContext` calls under `@babel/core@8`.

Babel 8's `requeue()` resets `shouldSkip`, so the `path.skip()` that used to run before `replaceWith()` no longer took effect and the plugin kept visiting — and re-wrapping — the `createContext` call it had just emitted. `@prefresh/babel-plugin` now declares `@babel/core` as a peer dependency (`^7.0.0 || ^8.0.0`) and `@prefresh/vite` widens its optional `@babel/core` peer range to match.
