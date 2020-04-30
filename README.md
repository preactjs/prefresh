# Preact-Refresh

**Experimental package**

We are still fleshing out the details on how to go about this approach best for [Preact](https://github.com/preactjs/preact), we'd
love to give you the best reloading experience possible.

## Setup

```
npm i -s preact-refresh
## OR
yarn add preact-refresh 
```

Then add it to your `webpack` config by doing

```js
import PreactRefreshPlugin from 'preact-refresh';

const config = {
  plugins: [
    new PreactRefreshPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true, // ensure dev-server.hot is on
    ...moreDevServerConfig
  },
  ...moreWebpackConfig
}
```

## Uncertainties

- [] error recovery
- [] state-hooks ordering
- [] adding dependencies to hooks
- [] component altering lifecycles
