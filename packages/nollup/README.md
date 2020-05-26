# Prefresh-nollup

[![npm version](https://badgen.net/npm/v/@prefresh/nollup)](https://www.npmjs.com/package/@prefresh/nollup)

## Setup

```
npm i -s @prefresh/nollup
## OR
yarn add @prefresh/nollup 
```

Then add it to your `rollup.config.js` config by doing

```js
import prefresh from '@prefresh/nollup';

const config = {
  ...
  plugins: [
    ...
    process.env.NODE_ENV === 'development' && prefresh()
  ]
};
```

Ensure that ```--hot``` flag is enabled or ```"hot": true``` is set in ```.nolluprc.js``` 

### Using hooks

If you're using `preact/hooks` you'll need something extra to ensure we can handle
changes in hooks well.

You'll need to add `react-refresh/babel` to your `babel-configuration` to make this
work together.

## Credits

- [PepsRyuu](https://github.com/PepsRyuu)
