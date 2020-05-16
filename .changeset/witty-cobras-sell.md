---
'@prefresh/webpack': minor
---

Make use of the `module.hot.invalidate` API when it's available, this will replace a full window reload when errors are thrown.
