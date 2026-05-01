---
'@prefresh/web-dev-server': major
'@prefresh/vite': major
---

Make Babel an optional peer dependency

`@babel/core` and `@prefresh/babel-plugin` are no longer hard dependencies of `@prefresh/vite`. Projects using modern versions of Vite no longer require Babel in their dependency tree.
