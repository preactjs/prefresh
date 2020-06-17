---
'@prefresh/next': patch
'@prefresh/nollup': patch
'@prefresh/snowpack': patch
'@prefresh/vite': patch
'@prefresh/webpack': patch
---

Change `window` to `self` so prefresh works outside of the browser
