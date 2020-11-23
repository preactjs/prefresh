# Prefresh-web-dev-server

[![npm version](https://badgen.net/npm/v/@prefresh/web-dev-server)](https://www.npmjs.com/package/@prefresh/web-dev-server)

## Setup

```
npm i --save-dev @prefresh/web-dev-server
## OR
yarn add --dev @prefresh/web-dev-server
```

web-dev-server.config.mjs

```js
export default {
  plugins: ["@prefresh/web-dev-server"]
}
```

## Best practices

### Recognition

We need to be able to recognise your components, this means that components should
start with a capital letter and hook should start with `use` followed by a capital letter.
This allows the Babel plugin to effectively recognise these.

Do note that a component as seen below is not named.

```jsx
export default () => {
  return <p>Want to refresh</p>
}
```

Instead do:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>
}

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.

