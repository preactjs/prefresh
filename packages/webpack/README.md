# Prefresh-webpack

[![npm version](https://badgen.net/npm/v/@prefresh/webpack)](https://www.npmjs.com/package/@prefresh/webpack)

## Setup

```
npm i -s @prefresh/webpack
## OR
yarn add @prefresh/webpack
```

Then add it to your `webpack` config by doing

```js
import PreactRefreshPlugin from '@prefresh/webpack';

const config = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new PreactRefreshPlugin(),
  ],
  devServer: {
    hot: true, // ensure dev-server.hot is on
    ...moreDevServerConfig,
  },
  ...moreWebpackConfig,
};
```

### Using hooks

If you're using `preact/hooks` you'll need something extra to ensure we can handle
changes in hooks well.

You'll need to add `@prefresh/babel-plugin` to your `babel-configuration` to make this
work together.

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
