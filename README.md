# Prefresh

Fast-refresh for Preact!

## Integrations

- [@web/dev-server](https://github.com/preactjs/prefresh/tree/main/packages/web-dev-server)
- [CRA with prefresh](https://github.com/jeremy-coleman/prefresh-cra)
- [gatsby](https://www.gatsbyjs.org/packages/gatsby-plugin-preact/)
- [next](https://github.com/preactjs/prefresh/tree/main/packages/next)
- [nollup](https://github.com/preactjs/prefresh/tree/main/packages/nollup)
- [preact-cli (--refresh)](https://github.com/preactjs/preact-cli#preact-watch)
- [snowpack](https://github.com/preactjs/prefresh/tree/main/packages/snowpack)
- [vite](https://github.com/preactjs/prefresh/tree/main/packages/vite)
- [webpack](https://github.com/preactjs/prefresh/tree/main/packages/webpack)

[Writing your own integration](https://dev.to/jovidecroock/prefresh-fast-refresh-for-preact-26kg)

## Best practices

### Recognition

We need to be able to recognise your components, this means that components should
start with a capital letter and hook should start with `use` followed by a capital letter.
This allows the Babel plugin to effectively recognise these.

Do note that a component as seen below is not named.

```jsx
export default () => {
  return <p>Want to refresh</p>;
};
```

Instead do:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>;
};

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.


### Recognition of `createContext` calls

Prefresh will statically identify unique calls to `createContext()`.  This means you should have an explicit `createContext()` call for every context you create.  For example:

```js
// Don't do this:
const contextHelper = () => createContext("Some default");
const ContextA = contextHelper();
const ContextB = contextHelper();

// Instead do this:
const ContextA = createContext("Some default");
const ContextB = createContext("Some default");
```

## Usage in IE11

If you want to use `@prefresh/webpack` or `@prefresh/next` with IE11, you'll need to transpile the `@prefresh/core` and `@prefresh/utils` packages.

For Next.js you can install `next-transpile-modules` and add the following code snippet to your `next.config.js`.

```js
const withTranspiledModules = require('next-transpile-modules')([
  '@prefresh/core',
  '@prefresh/utils',
]);

module.exports = withTM({
  /* regular next.js config options here */
});
```
