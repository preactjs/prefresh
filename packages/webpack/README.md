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
    ...moreDevServerConfig
  },
  ...moreWebpackConfig
}
```

### Using hooks

If you're using `preact/hooks` you'll need something extra to ensure we can handle
changes in hooks well.

You'll need to add `react-refresh/babel` to your `babel-configuration` to make this
work together.
