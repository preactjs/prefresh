---
'@prefresh/vite': patch
---

Concatenate inserted prelude to first line of script for sourcemaps

Prelude and footer code blocks are not supplied to babel sourcemap generation and new lines in them will offset sourcemaps.
This patch concatenates all of the prelude onto first line of module source to keep source map line mappings the same.
Footer is unchanged, but since it's at the end of the file it will not offset any code.
