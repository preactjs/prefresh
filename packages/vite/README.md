# Prefresh-vite

[![npm version](https://badgen.net/npm/v/@prefresh/vite)](https://www.npmjs.com/package/@prefresh/vite)

## Setup

```
npm i -s @prefresh/vite
## OR
yarn add @prefresh/vite
```

Then add it to your `vite.config.js` config:

```js
import prefresh from '@prefresh/vite';

export default {
  plugins: [prefresh()],
};
```

## Options

The plugin accepts two options `include` & `exclude` which are used in the [`@rollup/pluginutils.createFilter`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) to filter out files or include them.

The plugin also accepts the addition of [`parserPlugins`](https://babeljs.io/docs/en/babel-parser#plugins)

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
