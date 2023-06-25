# Prefresh

Fast-refresh for Preact!

## Integrations

- [@web/dev-server](https://github.com/preactjs/prefresh/tree/main/packages/web-dev-server)
- [gatsby](https://www.gatsbyjs.org/packages/gatsby-plugin-preact/)
- [nollup](https://github.com/preactjs/prefresh/tree/main/packages/nollup)
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

## Usage in IE11

If you want to use `@prefresh/webpack` with IE11, you'll need to transpile the `@prefresh/core` and `@prefresh/utils` packages.
