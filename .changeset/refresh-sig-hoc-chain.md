---
'@prefresh/vite': patch
'@prefresh/core': patch
---

Align $RefreshSig$ with React's HOC-chain design to fix memo-wrapped components

Both Babel and Oxc emit two `_s(…, key)` calls for a memo-wrapped component
(`_s(memo(_c = _s(inner, key)), key)`). The previous status-machine approach
mishandled the second keyed call, crashing with "Cannot set properties of
undefined" because the outer type had not yet been registered when `sign` was
called with `'needsHooks'`.

The new implementation follows the same pattern as
`createSignatureFunctionForTransform` in `vite-plugin-react`:

- Discriminate by `typeof key === 'string'` instead of a mutable `status` variable.
- Always call `sign` with `'begin'` for every keyed call, regardless of position
  in the HOC chain.
- Track `savedType` (the innermost type) and defer `'needsHooks'` collection to
  the first no-argument body call, guarded by a `didCollectHooks` flag.

`@prefresh/core`'s `sign` is also made idempotent on the `'begin'` path so that
the inner type's `getCustomHooks` is never overwritten by an outer HOC call that
carries no hook information, and the `'needsHooks'` path is guarded against a
missing signature entry.
