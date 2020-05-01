# Preact-Refresh

**Experimental package**

We are still fleshing out the details on how to go about this approach best for [Preact](https://github.com/preactjs/preact), we'd
love to give you the best reloading experience possible.

Note that now the refreshing component will dispose of its `hookState` to reload in case of added hook, ... this to ensure consistency.

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

- [x] component altering lifecycles
- [x] error recovery
- [ ] state-hooks ordering
- [ ] adding dependencies to hooks
