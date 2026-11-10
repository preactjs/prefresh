---
"@prefresh/vite": patch
---

`@prefresh/vite` no longer installs its own copy of Rolldown, so pnpm projects on Vite 8 resolve `@prefresh/rolldown`'s `rolldown` peer to the one Vite already ships instead of a second copy.
