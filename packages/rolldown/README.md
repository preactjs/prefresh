# @prefresh/rolldown

[![npm version](https://badgen.net/npm/v/@prefresh/rolldown)](https://www.npmjs.com/package/@prefresh/rolldown)

## Setup

```bash
pnpm add -D @prefresh/rolldown rolldown
```

Then add it to your Rolldown config:

```js
import prefresh from '@prefresh/rolldown';

export default {
  plugins: [prefresh()],
};
```

This plugin memoizes `createContext()` calls so context identity survives hot updates. It is intended to be used alongside Rolldown's React refresh transform for component refresh handling.

## Options

### `library`

Libraries to detect `createContext` imports from.

Default: `['preact', 'react', 'preact/compat']`

```js
prefresh({
  library: ['preact', 'preact/compat'],
});
```

### `enabled`

Enable or disable the transform.

Default: `true` in development and `false` otherwise.
